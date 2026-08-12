"use client";

import { useState } from "react";
import { createProduct } from "../../actions";

type VariantRow = { label: string; ml: string; price: string; stock: string };

export default function NewProductPage() {
  const [variants, setVariants] = useState<VariantRow[]>([
    { label: "500ml", ml: "500", price: "", stock: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function updateVariant(index: number, field: keyof VariantRow, value: string) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function addVariant() {
    setVariants((prev) => [...prev, { label: "", ml: "", price: "", stock: "" }]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await createProduct(formData);
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Add product</h1>

      <form action={handleSubmit} className="mt-6 flex max-w-xl flex-col gap-5">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
            Product name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="image" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
            Product photo
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImagePreview(file ? URL.createObjectURL(file) : null);
            }}
            className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground-muted outline-none focus:border-gold file:mr-3 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1 file:text-xs file:font-medium file:text-background-deep"
          />
          {imagePreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 h-32 w-32 rounded-md border border-border object-cover"
            />
          )}
        </div>

        <div>
          <label htmlFor="scentNotes" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
            Scent notes
          </label>
          <input
            id="scentNotes"
            name="scentNotes"
            placeholder="e.g. Lavender, chamomile, soft musk"
            className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-xs uppercase tracking-widest text-foreground-faint">
            Variants
          </legend>
          <div className="flex flex-col gap-3">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2">
                <input
                  name="variantLabel"
                  placeholder="Label, e.g. 500ml"
                  required
                  value={v.label}
                  onChange={(e) => updateVariant(i, "label", e.target.value)}
                  className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
                />
                <input
                  name="variantMl"
                  type="number"
                  placeholder="ml"
                  value={v.ml}
                  onChange={(e) => updateVariant(i, "ml", e.target.value)}
                  className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
                />
                <input
                  name="variantPrice"
                  type="number"
                  placeholder="Price"
                  required
                  value={v.price}
                  onChange={(e) => updateVariant(i, "price", e.target.value)}
                  className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
                />
                <input
                  name="variantStock"
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, "stock", e.target.value)}
                  className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  disabled={variants.length === 1}
                  className="rounded-md border border-border-strong px-2 text-xs text-foreground-faint hover:text-gold disabled:opacity-40"
                  aria-label="Remove variant"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="mt-3 text-xs text-gold-light hover:text-gold"
          >
            + Add another size
          </button>
        </fieldset>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gold py-3 text-sm font-medium text-background-deep hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save product"}
        </button>
      </form>
    </div>
  );
}