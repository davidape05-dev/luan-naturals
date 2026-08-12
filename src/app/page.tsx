import Link from "next/link";
import { generalInquiryLink } from "@/lib/whatsapp";

export default function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center">
      <p className="mb-4 text-xs tracking-[0.3em] text-foreground-faint uppercase">
        Fabric softeners
      </p>
      <h1 className="font-display text-6xl tracking-[0.05em] text-gold sm:text-7xl">
        LUÀN
      </h1>
      <p className="mt-3 text-sm tracking-[0.35em] text-foreground-muted uppercase">
        Luxury in every fabric
      </p>

      <div className="my-8 h-px w-16 bg-border-strong" />

      <p className="max-w-md text-sm leading-relaxed text-foreground-muted">
        Handcrafted in Nairobi. Premium fabric softener with natural
        fragrance blends.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-lg bg-gold px-7 py-3 text-sm font-medium tracking-wide text-background-deep hover:opacity-90 transition-opacity"
        >
          Explore collection
        </Link>
        <a
          href={generalInquiryLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border-strong px-6 py-3 text-sm tracking-wide text-gold-light hover:border-gold transition-colors"
        >
          Inquire via WhatsApp
        </a>
      </div>

      <dl className="mt-16 grid grid-cols-3 gap-8">
        <div>
          <dt className="sr-only">Natural ingredients</dt>
          <dd className="font-display text-2xl text-gold">100%</dd>
          <p className="mt-1 text-xs text-foreground-faint">
            Natural ingredients
          </p>
        </div>
        <div>
          <dt className="sr-only">Where it&apos;s made</dt>
          <dd className="font-display text-2xl text-gold">Nairobi</dd>
          <p className="mt-1 text-xs text-foreground-faint">Handcrafted</p>
        </div>
        <div>
          <dt className="sr-only">Delivery</dt>
          <dd className="font-display text-2xl text-gold">Fast</dd>
          <p className="mt-1 text-xs text-foreground-faint">
            Delivery in Nairobi
          </p>
        </div>
      </dl>
    </section>
  );
}
