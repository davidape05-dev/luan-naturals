"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

function formatKSh(amount: number) {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } =
    useCart();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close cart"
          onClick={closeCart}
          className="fixed inset-0 z-50 bg-black/50"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background-deep border-l border-border transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg text-gold-light">Your cart</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-foreground-muted hover:text-gold transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-foreground-muted">
              Your cart is empty. Add a product to get started.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex items-center justify-between gap-3 border-b border-border pb-4"
                >
                  <div>
                    <p className="text-sm text-foreground">{item.productName}</p>
                    <p className="text-xs text-foreground-faint">
                      {item.variantLabel}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        className="h-6 w-6 rounded border border-border text-foreground-muted hover:border-border-strong"
                        aria-label={`Decrease quantity of ${item.productName}`}
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        className="h-6 w-6 rounded border border-border text-foreground-muted hover:border-border-strong"
                        aria-label={`Increase quantity of ${item.productName}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-gold-light">
                      {formatKSh(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      className="text-xs text-foreground-faint hover:text-gold"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-foreground-muted">Subtotal</span>
            <span className="text-gold-light">{formatKSh(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className={`block w-full rounded-lg py-3 text-center text-sm font-medium transition-opacity ${
              items.length === 0
                ? "pointer-events-none bg-surface text-foreground-faint"
                : "bg-gold text-background-deep hover:opacity-90"
            }`}
          >
            Go to checkout
          </Link>
        </div>
      </aside>
    </>
  );
}
