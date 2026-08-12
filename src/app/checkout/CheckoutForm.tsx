"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  DELIVERY_FEES,
  DELIVERY_ZONE_LABELS,
  type DeliveryZone,
} from "@/lib/delivery";

function formatKSh(amount: number) {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

export default function CheckoutForm() {
  const { items, subtotal } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("cbd");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    orderCode: string;
    total: number;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = DELIVERY_FEES[deliveryZone];
  const total = subtotal + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          deliveryZone,
          deliveryAddress,
          notes,
          items: items.map((i) => ({
            variantId: i.variantId,
            productName: i.productName,
            variantLabel: i.variantLabel,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult({
        orderCode: data.orderCode,
        total: data.total,
        message: data.message,
      });
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && !result) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl text-gold-light">Checkout</h1>
        <p className="mt-4 text-sm text-foreground-muted">
          Your cart is empty. Add a product before checking out.
        </p>
        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="mt-6 rounded-lg bg-gold px-6 py-3 text-sm font-medium text-background-deep hover:opacity-90 transition-opacity"
        >
          Browse the shop
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl text-gold-light">
          Order {result.orderCode}
        </h1>
        <p className="mt-4 text-sm text-foreground-muted">
          {result.message ??
            "Your order was received. We'll confirm payment shortly."}
        </p>
        <p className="mt-2 text-sm text-foreground-faint">
          Total due: {formatKSh(result.total)}
        </p>
        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="mt-8 rounded-lg border border-border-strong px-6 py-3 text-sm text-gold-light hover:border-gold transition-colors"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-display text-3xl text-foreground">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="customerName" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
              Full name
            </label>
            <input
              id="customerName"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
            />
          </div>

          <div>
            <label htmlFor="customerPhone" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
              M-Pesa phone number
            </label>
            <input
              id="customerPhone"
              type="tel"
              required
              placeholder="07XX XXX XXX"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
            />
          </div>

          <fieldset>
            <legend className="mb-1 text-xs uppercase tracking-widest text-foreground-faint">
              Delivery zone
            </legend>
            <div className="flex gap-2">
              {(Object.keys(DELIVERY_ZONE_LABELS) as DeliveryZone[]).map(
                (zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setDeliveryZone(zone)}
                    aria-pressed={zone === deliveryZone}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                      zone === deliveryZone
                        ? "border-gold bg-gold text-background-deep"
                        : "border-border-strong text-foreground-muted hover:border-gold"
                    }`}
                  >
                    {DELIVERY_ZONE_LABELS[zone]}
                    <span className="block text-xs opacity-80">
                      {formatKSh(DELIVERY_FEES[zone])}
                    </span>
                  </button>
                )
              )}
            </div>
          </fieldset>

          <div>
            <label htmlFor="deliveryAddress" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
              Delivery address
            </label>
            <textarea
              id="deliveryAddress"
              required
              rows={3}
              placeholder="Estate, street, landmark, house/apartment number"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
            />
          </div>

          <div>
            <label htmlFor="notes" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
              Notes (optional)
            </label>
            <input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-gold py-3 text-sm font-medium text-background-deep hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Pay with M-Pesa"}
          </button>
        </form>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-display text-lg text-gold-light">
            Order summary
          </h2>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.variantId} className="flex justify-between text-sm">
                <span className="text-foreground-muted">
                  {item.productName} ({item.variantLabel}) × {item.quantity}
                </span>
                <span className="text-foreground">
                  {formatKSh(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm">
            <span className="text-foreground-muted">Subtotal</span>
            <span className="text-foreground">{formatKSh(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-foreground-muted">
              Delivery ({DELIVERY_ZONE_LABELS[deliveryZone]})
            </span>
            <span className="text-foreground">{formatKSh(deliveryFee)}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="text-foreground-muted">Total</span>
            <span className="text-lg text-gold-light">{formatKSh(total)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
