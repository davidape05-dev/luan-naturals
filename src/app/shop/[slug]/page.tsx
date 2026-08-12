import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { getApprovedReviews } from "@/lib/reviews";
import ProductDetail from "./ProductDetail";
import ReviewsSection from "@/components/ReviewsSection";

// Product catalog is managed live in the admin panel, so always fetch fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found | LUÀN" };
  return {
    title: `${product.name} | LUÀN`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const reviews = await getApprovedReviews(product.id);

  return (
    <>
      <ProductDetail product={product} />
      <ReviewsSection productSlug={product.slug} reviews={reviews} />
    </>
  );
}