import { NextRequest, NextResponse } from "next/server";
import { membershipSchema } from "@/lib/validations/membershipSchema";
import { membershipPriceIds, stripe } from "@/lib/stripe/config";

export async function POST(req: NextRequest) {
  const parsed = membershipSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid membership payload" }, { status: 400 });

  const { membershipType, userId, userEmail } = parsed.data;
  const price = membershipPriceIds[membershipType];
  if (!price) return NextResponse.json({ error: "Stripe price is not configured" }, { status: 500 });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: userEmail,
    line_items: [{ price, quantity: 1 }],
    metadata: { userId, membershipType },
    success_url: `${process.env.NEXT_PUBLIC_URL}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/membership`
  });

  return NextResponse.json({ url: session.url });
}
