import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | LUÀN",
  description: "The story behind LUÀN's handcrafted fabric softeners.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="font-display text-4xl text-gold-light">About LUÀN</h1>
      <p className="mt-6 text-sm leading-relaxed text-foreground-muted">
        LUÀN handcrafts fabric softeners in Nairobi, blending natural
        fragrances to bring a small luxury into everyday laundry. Every
        bottle is made in small batches and delivered across Nairobi and
        its outskirts.
      </p>
    </section>
  );
}
