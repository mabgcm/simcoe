import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendDonationReceiptEmail } from "@/lib/email/sender";

const schema = z.object({ to: z.string().email(), name: z.string().min(1), amount: z.number().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid email payload" }, { status: 400 });
  await sendDonationReceiptEmail(parsed.data.to, parsed.data.name, parsed.data.amount);
  return NextResponse.json({ ok: true });
}
