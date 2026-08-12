import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, slug, is_active, product_variants(id, label, price, stock)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-foreground">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-background-deep hover:opacity-90 transition-opacity"
        >
          Add product
        </Link>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-400">
          Couldn&apos;t load products: {error.message}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {products?.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-gold-light">
                {product.name}
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs ${
                    product.is_active ? "text-foreground-faint" : "text-red-400"
                  }`}
                >
                  {product.is_active ? "Active" : "Hidden"}
                </span>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="text-xs text-gold-light hover:text-gold"
                >
                  Edit
                </Link>
              </div>
            </div>
            <ul className="mt-3 flex flex-wrap gap-3">
              {(product.product_variants as
                | { id: string; label: string; price: number; stock: number }[]
                | null
              )?.map((v) => (
                <li
                  key={v.id}
                  className="rounded-md border border-border px-3 py-1 text-xs text-foreground-muted"
                >
                  {v.label} · KSh {v.price} · {v.stock} in stock
                </li>
              ))}
            </ul>
          </div>
        ))}

        {products && products.length === 0 && (
          <p className="text-sm text-foreground-muted">
            No products yet. Add your first one.
          </p>
        )}
      </div>
    </div>
  );
}