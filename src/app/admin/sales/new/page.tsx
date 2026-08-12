import { createClient } from "@/lib/supabase/server";
import RecordSaleForm from "./RecordSaleForm";

export default async function RecordSalePage({
  searchParams,
}: {
  searchParams: Promise<{ recorded?: string }>;
}) {
  const { recorded } = await searchParams;
  const supabase = await createClient();
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, label, price, stock, products(name)")
    .order("label");

  const options = (variants ?? []).map((v) => ({
    id: v.id,
    label: `${(v.products as unknown as { name: string } | null)?.name ?? "Product"} — ${v.label} (${v.stock} in stock)`,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Record sale</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        For a sale made outside the website — stock updates automatically,
        same as an online order.
      </p>

      {recorded && (
        <p className="mt-4 rounded-md border border-border bg-surface px-4 py-3 text-sm text-gold-light">
          Sale {recorded} recorded.
        </p>
      )}

      <RecordSaleForm options={options} />
    </div>
  );
}
