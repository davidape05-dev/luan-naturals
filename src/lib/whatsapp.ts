// Central place to change the business WhatsApp number and message format.
// No WhatsApp Business API needed for this — these are plain wa.me deep
// links that open a pre-filled chat.

const BUSINESS_WHATSAPP_NUMBER = "254700000000"; // TODO: replace with real number, no leading +

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encoded}`;
}

export function productInquiryLink(productName: string, variantLabel?: string) {
  const variantPart = variantLabel ? ` (${variantLabel})` : "";
  return buildWhatsAppLink(
    `Hi LUÀN, I'd like to ask about ${productName}${variantPart}.`
  );
}

export function generalInquiryLink() {
  return buildWhatsAppLink("Hi LUÀN, I have a question about your products.");
}
