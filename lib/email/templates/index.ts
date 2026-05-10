export function membershipWelcomeTemplate(name: string) {
  return `<p>Merhaba ${name},</p><p>Simcoe Turkish Association üyeliğiniz aktif edildi. Topluluğumuza hoş geldiniz.</p>`;
}

export function paymentFailedTemplate() {
  return "<p>Üyelik ödemeniz tamamlanamadı. Lütfen ödeme yönteminizi güncelleyin veya STA ekibiyle iletişime geçin.</p>";
}

export function donationReceiptTemplate(name: string, amount: number) {
  return `<p>Merhaba ${name},</p><p>Simcoe Turkish Association'a yaptığınız $${amount.toFixed(2)} CAD bağış için teşekkür ederiz.</p>`;
}
