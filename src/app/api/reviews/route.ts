import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const body = await request.json();
  const { orderCode, phone, productSlug, rating, comment } = body as {
    orderCode: string;
    phone: string;
    productSlug: string;
    rating: number;
    comment: string;
  };

  if (!orderCode?.trim() || !phone?.trim() || !productSlug || !rating) {
    return NextResponse.json(
      { error: "Fill in your order code, phone number, and a rating." },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, customer_phone, order_items(product_variant_id, product_variants(product_id))")
    .eq("order_code", orderCode.trim())
    .single();

  if (!order || order.customer_phone.replace(/\s+/g, "") !== phone.replace(/\s+/g, "")) {
    return NextResponse.json(
      { error: "We couldn't find an order matching that code and phone number." },
      { status: 404 }
    );
  }

  type OrderItemRow = {
    product_variants: { product_id: string } | { product_id: string }[] | null;
  };
  const items = (order.order_items ?? []) as OrderItemRow[];
  const boughtThisProduct = items.some((item) => {
    const variant = Array.isArray(item.product_variants)
      ? item.product_variants[0]
      : item.product_variants;
    return variant?.product_id === product.id;
  });

  if (!boughtThisProduct) {
    return NextResponse.json(
      { error: "That order doesn't include this product." },
      { status: 400 }
    );
  }

  const { error: insertError } = await supabase.from("reviews").insert({
    order_id: order.id,
    product_id: product.id,
    rating,
    comment: comment?.trim() || null,
    is_approved: false,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    status: "submitted",
    message: "Thanks — your review is submitted and will show once approved.",
  });
}