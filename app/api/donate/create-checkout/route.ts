import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe/config";

const schema = z.object({
  amount: z.coerce.number().min(1, "Bağış tutarı en az $1 olmalıdır."),
  interval: z.enum(["once", "month", "year"]),
  donorName: z.string().min(1, "Ad gereklidir."),
  donorEmail: z.string().min(1, "E-posta gereklidir.")
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message || "Geçersiz ödeme bilgileri.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
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
