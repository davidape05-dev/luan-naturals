import { createClient } from "@/lib/supabase/server";
import ReviewActions from "./ReviewActions";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: pending } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, products(name), orders(customer_name)")
    .eq("is_approved", false)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Reviews</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Pending reviews — approve to publish on the product page.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {pending && pending.length === 0 && (
          <p className="text-sm text-foreground-muted">Nothing pending.</p>
        )}
        {pending?.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gold-light">
                {(review.products as unknown as { name: string } | null)?.name}
              </p>
              <span className="text-gold">
                {"★".repeat(review.rating)}
                <span className="text-border-strong">
                  {"★".repeat(5 - review.rating)}
                </span>
              </span>
            </div>
            <p className="mt-1 text-xs text-foreground-faint">
              {(review.orders as unknown as { customer_name: string } | null)
                ?.customer_name ?? "Customer"}
            </p>
            {review.comment && (
              <p className="mt-2 text-sm text-foreground-muted">
                {review.comment}
              </p>
            )}
            <ReviewActions reviewId={review.id} />
          </div>
        ))}
      </div>
    </div>
  );
}