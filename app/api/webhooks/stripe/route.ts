import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { handleCheckoutCompleted, handleInvoicePaymentFailed, handleSubscriptionDeleted } from "@/lib/stripe/webhooks";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing Stripe signature configuration" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") await handleCheckoutCompleted(event.data.object);
  if (event.type === "invoice.payment_failed") await handleInvoicePaymentFailed(event.data.object);
  if (event.type === "customer.subscription.deleted") await handleSubscriptionDeleted(event.data.object);

  return NextResponse.json({ received: true });
}
