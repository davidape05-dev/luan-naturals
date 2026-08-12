"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { productInquiryLink } from "@/lib/whatsapp";

function formatKSh(amount: number) {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);

  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex h-80 items-center justify-center rounded-xl border border-border bg-surface">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5a7367" strokeWidth="1.6" aria-hidden="true">
              <path d="M12 3c3 4 6 7 6 10a6 6 0 1 1-12 0c0-3 3-6 6-10Z" />
            </svg>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl text-gold-light">
            {product.name}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-foreground-faint">
            {product.scentNotes}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
            {product.description}
          </p>

          <p className="mt-6 text-2xl text-foreground">
            {formatKSh(variant.price)}
          </p>

          <fieldset className="mt-6">
            <legend className="mb-2 text-xs uppercase tracking-widest text-foreground-faint">
              Size
            </legend>
            <div className="flex gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  aria-pressed={v.id === variantId}
                  className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                    v.id === variantId
                      ? "border-gold bg-gold text-background-deep"
                      : "border-border-strong text-foreground-muted hover:border-gold"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border-strong">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-foreground-muted hover:text-gold"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-foreground-muted hover:text-gold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                addItem(
                  {
                    productSlug: product.slug,
                    productName: product.name,
                    variantId: variant.id,
                    variantLabel: variant.label,
                    price: variant.price,
                  },
                  quantity
                );
                openCart();
              }}
              className="flex-1 rounded-md bg-gold py-3 text-sm font-medium text-background-deep hover:opacity-90 transition-opacity"
            >
              Add to cart
            </button>
          </div>

          <a
            href={productInquiryLink(product.name, variant.label)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-gold-light hover:text-gold transition-colors"
          >
            Ask about this product on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
