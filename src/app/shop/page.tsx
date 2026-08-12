import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Shop | LUÀN",
  description:
    "Browse LUÀN's handcrafted fabric softeners — natural fragrance blends delivered across Nairobi.",
};

// Product catalog is managed live in the admin panel, so always fetch fresh.
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-display text-4xl text-foreground">Our Collection</h1>
      <p className="mt-2 text-sm text-foreground-faint">
        {products.length} product{products.length === 1 ? "" : "s"} available
      </p>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-foreground-muted">
          No products yet — check back soon.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
