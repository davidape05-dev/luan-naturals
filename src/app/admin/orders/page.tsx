import { createClient } from "@/lib/supabase/server";

function formatKSh(amount: number) {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_code, customer_name, status, source, total, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Orders</h1>

      {error && (
        <p className="mt-6 text-sm text-red-400">
          Couldn&apos;t load orders: {error.message}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-background-deep text-xs uppercase tracking-widest text-foreground-faint">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-t border-border">
                <td className="px-4 py-3 text-gold-light">{order.order_code}</td>
                <td className="px-4 py-3 text-foreground-muted">
                  {order.customer_name}
                </td>
                <td className="px-4 py-3 text-foreground-muted capitalize">
                  {order.source}
                </td>
                <td className="px-4 py-3 text-foreground-muted capitalize">
                  {order.status}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {formatKSh(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders && orders.length === 0 && (
          <p className="px-4 py-6 text-sm text-foreground-muted">
            No orders yet.
          </p>
        )}
      </div>
    </div>
  );
}
