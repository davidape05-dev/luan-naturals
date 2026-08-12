import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, scent_notes, image_url, is_active, product_variants(id, label, ml, price, stock)"
    )
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Edit product</h1>
      <EditProductForm product={product} />
    </div>
  );
}