// Public-facing product data, read live from Supabase. This replaces the
// earlier placeholder catalog now that the admin panel writes real
// products into the database.

import { createClient } from "@/lib/supabase/server";

export type ProductVariant = {
  id: string;
  label: string; // e.g. "500ml"
  ml: number;
  price: number; // KSh
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  scentNotes: string;
  imageUrl: string | null;
  variants: ProductVariant[];
};

type RawVariant = {
  id: string;
  label: string;
  ml: number;
  price: number;
  stock: number;
};

type RawProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  scent_notes: string | null;
  image_url: string | null;
  product_variants: RawVariant[];
};

function mapProduct(row: RawProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    scentNotes: row.scent_notes ?? "",
    imageUrl: row.image_url,
    variants: (row.product_variants ?? [])
      .slice()
      .sort((a, b) => a.ml - b.ml),
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, scent_notes, image_url, product_variants(id, label, ml, price, stock)"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as RawProduct[]).map(mapProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, scent_notes, image_url, product_variants(id, label, ml, price, stock)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return undefined;
  return mapProduct(data as unknown as RawProduct);
}