"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { generalInquiryLink } from "@/lib/whatsapp";

function DropletMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-gold)"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M12 3c3 4 6 7 6 10a6 6 0 1 1-12 0c0-3 3-6 6-10Z" />
    </svg>
  );
}

export default function Navbar() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background-deep">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <DropletMark />
          <span className="font-display text-lg tracking-[0.15em] text-gold">
            LUÀN
          </span>
        </Link>

        <nav className="hidden gap-8 text-sm tracking-wide text-foreground-muted sm:flex">
          <Link href="/shop" className="hover:text-gold transition-colors">
            Shop
          </Link>
          <Link href="/about" className="hover:text-gold transition-colors">
            About
          </Link>
          <Link href="/shop#reviews" className="hover:text-gold transition-colors">
            Reviews
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <a
            href={generalInquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask a question on WhatsApp"
            className="text-foreground hover:text-gold transition-colors"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.87.5 3.62 1.38 5.13L2 22l4.99-1.35A9.94 9.94 0 0 0 12.02 22C17.55 22 22 17.52 22 12S17.55 2 12.02 2Zm0 18.13c-1.64 0-3.17-.47-4.46-1.28l-.32-.19-2.96.8.79-2.89-.2-.3a8.06 8.06 0 0 1-1.27-4.27c0-4.48 3.65-8.13 8.13-8.13S20.15 7.52 20.15 12s-3.65 8.13-8.13 8.13Zm4.47-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.31-.01-.47-.01-.16 0-.42.06-.65.3-.22.24-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
            </svg>
          </a>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className="relative text-foreground hover:text-gold transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 6h2l2.4 11.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20.8 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9.5" cy="21" r="1" />
              <circle cx="17.5" cy="21" r="1" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-background-deep">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
