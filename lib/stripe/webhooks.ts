import Stripe from "stripe";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { sendMembershipWelcomeEmail, sendPaymentFailedEmail } from "@/lib/email/sender";

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const adminDb = getAdminDb();
  const userId = session.metadata?.userId;
  const membershipType = session.metadata?.membershipType;
  const donation = session.metadata?.donation;

  if (donation === "true") {
    await adminDb.collection("donations").add({
      donorName: session.customer_details?.name || "Anonymous",
      donorEmail: session.customer_details?.email || "",
      amount: (session.amount_total || 0) / 100,
      currency: "cad",
      stripePaymentIntentId: String(session.payment_intent || ""),
      isRecurring: session.mode === "subscription",
      createdAt: Timestamp.now(),
      status: "completed"
    });
    return;
  }

  if (!userId || !membershipType) return;

  const now = Timestamp.now();
  const expiry = Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));

  await adminDb.collection("memberships").add({
    userId,
    type: membershipType,
    status: "active",
    stripeSubscriptionId: String(session.subscription || ""),
    stripePaymentIntentId: String(session.payment_intent || ""),
    startDate: now,
    expiryDate: expiry,
    amount: (session.amount_total || 0) / 100,
    autoRenew: session.mode === "subscription",
    createdAt: now
  });

  await adminDb.collection("users").doc(userId).set(
    {
      role: "member",
      membershipStatus: "active",
      membershipType,
      membershipExpiry: expiry,
      stripeCustomerId: String(session.customer || ""),
      updatedAt: now
    },
    { merge: true }
  );

  if (session.customer_details?.email) {
    await sendMembershipWelcomeEmail(session.customer_details.email, session.customer_details.name || "STA Member");
  }
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const adminDb = getAdminDb();
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const users = await adminDb.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();
  const user = users.docs[0];
  if (!user) return;

  await user.ref.set({ membershipStatus: "expired", updatedAt: Timestamp.now() }, { merge: true });
  const email = user.data().email as string | undefined;
  if (email) await sendPaymentFailedEmail(email);
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const adminDb = getAdminDb();
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const users = await adminDb.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();
  const user = users.docs[0];
  if (user) await user.ref.set({ membershipStatus: "expired", updatedAt: Timestamp.now() }, { merge: true });
}
