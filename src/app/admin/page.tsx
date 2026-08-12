import { createClient } from "@/lib/supabase/server";
import EnableNotificationsButton from "@/components/EnableNotificationsButton";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: pendingOrders }, { data: lowStock }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("product_variants")
        .select("label, stock, products(name)")
        .lt("stock", 5)
        .order("stock", { ascending: true }),
    ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Dashboard</h1>

      <div className="mt-4">
        <EnableNotificationsButton />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-widest text-foreground-faint">
            Products
          </p>
          <p className="mt-2 font-display text-3xl text-gold-light">
            {productCount ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-widest text-foreground-faint">
            Pending orders
          </p>
          <p className="mt-2 font-display text-3xl text-gold-light">
            {pendingOrders ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-widest text-foreground-faint">
            Low stock variants
          </p>
          <p className="mt-2 font-display text-3xl text-gold-light">
            {lowStock?.length ?? 0}
          </p>
        </div>
      </div>

      {lowStock && lowStock.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm uppercase tracking-widest text-foreground-faint">
            Running low
          </h2>
          <ul className="flex flex-col gap-2">
            {lowStock.map((v, i) => (
              <li
                key={i}
                className="flex justify-between rounded-md border border-border bg-surface px-4 py-2 text-sm"
              >
                <span className="text-foreground-muted">
                  {(v.products as unknown as { name: string } | null)?.name}{" "}
                  — {v.label}
                </span>
                <span className="text-gold-light">{v.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}