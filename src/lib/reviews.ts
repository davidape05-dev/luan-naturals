import { createClient } from "@/lib/supabase/server";

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export async function getApprovedReviews(productId: string): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}