"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateProduct,
  deleteProduct,
  updateVariant,
  addVariant,
  deleteVariant,
} from "../../../actions";

type Variant = {
  id: string;
  label: string;
  ml: number;
  price: number;
  stock: number;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  scent_notes: string | null;
  image_url: string | null;
  is_active: boolean;
  product_variants: Variant[];
};

function VariantRow({ variant }: { variant: Variant }) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [removed, setRemoved] = useState(false);

  if (removed) return null;

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-start gap-2">
      <form
        action={async (formData) => {
          setSaving(true);
          setError(null);
          const result = await updateVariant(variant.id, formData);
          if (result?.error) setError(result.error);
          setSaving(false);
        }}
        className="contents"
      >
        <input
          name="label"
          defaultValue={variant.label}
          className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
        />
        <input
          name="ml"
          type="number"
          defaultValue={variant.ml}
          className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
        />
        <input
          name="price"
          type="number"
          defaultValue={variant.price}
          className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
        />
        <input
          name="stock"
          type="number"
          defaultValue={variant.stock}
          className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-gold px-2 text-xs font-medium text-background-deep disabled:opacity-60"
        >
          {saving ? "…" : "Save"}
        </button>
      </form>
      <button
        type="button"
        disabled={deleting}
        onClick={async () => {
          setDeleting(true);
          const result = await deleteVariant(variant.id);
          if (result?.error) {
            setError(result.error);
            setDeleting(false);
          } else {
            setRemoved(true);
          }
        }}
        className="col-span-5 mt-1 w-fit text-xs text-foreground-faint hover:text-gold"
      >
        {deleting ? "Removing…" : "Remove this size"}
      </button>
      {error && <p className="col-span-5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function AddVariantForm({ productId }: { productId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <form
      action={async (formData) => {
        setAdding(true);
        setError(null);
        const result = await addVariant(productId, formData);
        if (result?.error) setError(result.error);
        setAdding(false);
      }}
      className="mt-3 grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2"
    >
      <input
        name="label"
        placeholder="Label, e.g. 500ml"
        required
        className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
      />
      <input
        name="ml"
        type="number"
        placeholder="ml"
        className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        required
        className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        className="rounded-md border border-border-strong bg-surface px-2 py-2 text-xs text-foreground outline-none focus:border-gold"
      />
      <button
        type="submit"
        disabled={adding}
        className="rounded-md border border-border-strong px-2 text-xs text-gold-light hover:border-gold disabled:opacity-60"
      >
        {adding ? "…" : "+ Add"}
      </button>
      {error && <p className="col-span-5 text-xs text-red-400">{error}</p>}
    </form>
  );
}

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product.image_url
  );
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <div className="mt-6 flex max-w-xl flex-col gap-10">
      <form
        action={async (formData) => {
          setSubmitting(true);
          setError(null);
          setSaved(false);
          const result = await updateProduct(product.id, formData);
          if (result?.error) setError(result.error);
          else setSaved(true);
          setSubmitting(false);
        }}
        className="flex flex-col gap-5"
      >
        <div>
          <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
            Product name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product.name}
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
              if (file) setImagePreview(URL.createObjectURL(file));
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
            defaultValue={product.scent_notes ?? ""}
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
            defaultValue={product.description ?? ""}
            className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground-muted">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product.is_active}
            className="h-4 w-4 accent-[color:var(--color-gold)]"
          />
          Visible on the shop
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && !error && (
          <p className="text-sm text-gold-light">Saved.</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gold py-3 text-sm font-medium text-background-deep hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div>
        <h2 className="mb-3 text-xs uppercase tracking-widest text-foreground-faint">
          Sizes / variants
        </h2>
        <div className="flex flex-col gap-4">
          {product.product_variants.map((v) => (
            <VariantRow key={v.id} variant={v} />
          ))}
        </div>
        <AddVariantForm productId={product.id} />
      </div>

      <div className="border-t border-border pt-6">
        {deleteError && (
          <p className="mb-3 text-sm text-red-400">{deleteError}</p>
        )}
        <button
          type="button"
          disabled={deleting}
          onClick={async () => {
            if (
              !confirm(
                `Delete "${product.name}" permanently? This can't be undone.`
              )
            )
              return;
            setDeleting(true);
            setDeleteError(null);
            const result = await deleteProduct(product.id);
            if (result?.error) {
              setDeleteError(result.error);
              setDeleting(false);
            } else {
              router.push("/admin/products");
            }
          }}
          className="text-sm text-red-400 hover:text-red-300 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete this product"}
        </button>
      </div>
    </div>
  );
}