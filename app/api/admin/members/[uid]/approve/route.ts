import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import type { MembershipType } from "@/types";

const membershipAmounts: Record<MembershipType, number> = {
  individual: 30,
  family: 50,
  student: 15,
  corporate: 150
};

export async function POST(req: NextRequest, { params }: { params: { uid: string } }) {
  const session = req.cookies.get("session")?.value;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const auth = getAdminAuth();
  const db = getAdminDb();
  const decoded = await auth.verifyIdToken(session);
  const adminDoc = await db.collection("users").doc(decoded.uid).get();
  const adminRole = adminDoc.data()?.role;

  if (adminRole !== "admin" && adminRole !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userRef = db.collection("users").doc(params.uid);
  const userDoc = await userRef.get();
  if (!userDoc.exists) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  const user = userDoc.data() || {};
  const membershipType = (user.membershipPlan || user.membershipType || "individual") as MembershipType;
  const now = Timestamp.now();
  const expiry = Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));

  await db.runTransaction(async (transaction) => {
    transaction.set(
      userRef,
      {
        role: user.role || "member",
        membershipStatus: "active",
        membershipPlan: membershipType,
        membershipType,
        membershipExpiry: expiry,
        paymentStatus: "approved",
        paymentApprovedAt: now,
        paymentApprovedBy: decoded.uid,
        updatedAt: now
      },
      { merge: true }
    );

    const membershipRef = db.collection("memberships").doc();
    transaction.set(membershipRef, {
      userId: params.uid,
      type: membershipType,
      status: "active",
      startDate: now,
      expiryDate: expiry,
      amount: membershipAmounts[membershipType] ?? 0,
      autoRenew: false,
      manualApproval: true,
      approvedBy: decoded.uid,
      createdAt: now
    });
  });

  return NextResponse.json({ ok: true });
}
