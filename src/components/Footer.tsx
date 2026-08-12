import { generalInquiryLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-deep">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center">
        <span className="font-display text-base tracking-[0.15em] text-gold">
          LUÀN
        </span>
        <p className="max-w-md text-sm text-foreground-muted">
          Handcrafted fabric softeners, delivered across Nairobi and its
          outskirts.
        </p>
        <a
          href={generalInquiryLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gold-light hover:text-gold transition-colors"
        >
          Ask a question on WhatsApp
        </a>
        <p className="mt-4 text-xs text-foreground-faint">
          &copy; {new Date().getFullYear()} LUÀN Naturals. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
