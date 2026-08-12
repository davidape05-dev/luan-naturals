"use client";

import { useState } from "react";
import { recordManualSale } from "../../actions";

export default function RecordSaleForm({
  options,
}: {
  options: { id: string; label: string }[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await recordManualSale(formData);
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="mt-6 flex max-w-md flex-col gap-5">
      <div>
        <label htmlFor="variantId" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
          Product
        </label>
        <select
          id="variantId"
          name="variantId"
          required
          className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
        >
          <option value="">Select a product</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
          Quantity sold
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          defaultValue={1}
          required
          className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
        />
      </div>

      <div>
        <label htmlFor="customerName" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
          Customer name (optional)
        </label>
        <input
          id="customerName"
          name="customerName"
          placeholder="Walk-in customer"
          className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-gold py-3 text-sm font-medium text-background-deep hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {submitting ? "Recording…" : "Record sale"}
      </button>
    </form>
  );
}
