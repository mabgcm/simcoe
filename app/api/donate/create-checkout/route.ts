import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe/config";

const schema = z.object({
  amount: z.number().min(1),
  interval: z.enum(["once", "month", "year"]),
  donorName: z.string().min(1),
  donorEmail: z.string().email()
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid donation payload" }, { status: 400 });
  const { amount, interval, donorEmail, donorName } = parsed.data;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: interval === "once" ? "payment" : "subscription",
    customer_email: donorEmail,
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: { name: `STA Donation - ${donorName}` },
          unit_amount: Math.round(amount * 100),
          recurring: interval === "once" ? undefined : { interval }
        },
        quantity: 1
      }
    ],
    metadata: { donation: "true", donorName, interval },
    success_url: `${process.env.NEXT_PUBLIC_URL}/donate?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/donate`
  });

  return NextResponse.json({ url: session.url });
}
