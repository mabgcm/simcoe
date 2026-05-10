import { Resend } from "resend";
import { membershipWelcomeTemplate, paymentFailedTemplate, donationReceiptTemplate } from "@/lib/email/templates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.EMAIL_FROM || "noreply@simcoeturkish.ca";

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) return { skipped: true };
  return resend.emails.send({ from, to, subject, html });
}

export function sendMembershipWelcomeEmail(to: string, name: string) {
  return sendEmail(to, "STA üyeliğiniz aktif", membershipWelcomeTemplate(name));
}

export function sendPaymentFailedEmail(to: string) {
  return sendEmail(to, "STA üyelik ödemeniz tamamlanamadı", paymentFailedTemplate());
}

export function sendDonationReceiptEmail(to: string, name: string, amount: number) {
  return sendEmail(to, "STA bağış makbuzunuz", donationReceiptTemplate(name, amount));
}

export function sendContactEmail(payload: { name: string; email: string; subject: string; message: string }) {
  const to = process.env.STA_CONTACT_EMAIL || "info@simcoeturkish.org";
  return sendEmail(
    to,
    `STA Contact: ${payload.subject}`,
    `<p><strong>Name:</strong> ${payload.name}</p><p><strong>Email:</strong> ${payload.email}</p><p>${payload.message}</p>`
  );
}
