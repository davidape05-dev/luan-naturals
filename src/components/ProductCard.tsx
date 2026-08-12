"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { productInquiryLink } from "@/lib/whatsapp";

function formatKSh(amount: number) {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const defaultVariant = product.variants[0];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <Link
        href={`/shop/${product.slug}`}
        className="flex h-40 items-center justify-center bg-background-deep"
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#5a7367" strokeWidth="1.6" aria-hidden="true">
            <path d="M12 3c3 4 6 7 6 10a6 6 0 1 1-12 0c0-3 3-6 6-10Z" />
          </svg>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/shop/${product.slug}`}>
          <p className="font-display text-base text-gold-light">
            {product.name}
          </p>
        </Link>
        <p className="mb-2 text-xs text-foreground-faint">
          {defaultVariant.label}
        </p>
        <p className="mb-3 text-sm font-medium text-foreground">
          {formatKSh(defaultVariant.price)}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              addItem({
                productSlug: product.slug,
                productName: product.name,
                variantId: defaultVariant.id,
                variantLabel: defaultVariant.label,
                price: defaultVariant.price,
              })
            }
            className="flex-1 rounded-md bg-gold py-2 text-xs font-medium text-background-deep hover:opacity-90 transition-opacity"
          >
            Add to cart
          </button>
          <a
            href={productInquiryLink(product.name, defaultVariant.label)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask about ${product.name} on WhatsApp`}
            className="flex w-9 items-center justify-center rounded-md border border-border-strong text-gold-light hover:border-gold transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.87.5 3.62 1.38 5.13L2 22l4.99-1.35A9.94 9.94 0 0 0 12.02 22C17.55 22 22 17.52 22 12S17.55 2 12.02 2Zm0 18.13c-1.64 0-3.17-.47-4.46-1.28l-.32-.19-2.96.8.79-2.89-.2-.3a8.06 8.06 0 0 1-1.27-4.27c0-4.48 3.65-8.13 8.13-8.13S20.15 7.52 20.15 12s-3.65 8.13-8.13 8.13Zm4.47-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.31-.01-.47-.01-.16 0-.42.06-.65.3-.22.24-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
