"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notifyAdmins } from "@/lib/push";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const description = String(formData.get("description") ?? "");
  const scentNotes = String(formData.get("scentNotes") ?? "");

  let imageUrl: string | null = null;
  const imageFile = formData.get("image") as File | null;

  if (imageFile && imageFile.size > 0) {
    const extension = imageFile.name.split(".").pop() || "jpg";
    const path = `${slug}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, imageFile, {
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      return {
        error: `Product photo didn't upload: ${uploadError.message}. Make sure a public "product-images" bucket exists in Supabase Storage.`,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);
    imageUrl = publicUrlData.publicUrl;
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description,
      scent_notes: scentNotes,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (productError || !product) {
    return { error: productError?.message ?? "Could not create product." };
  }

  const variantLabels = formData.getAll("variantLabel") as string[];
  const variantMls = formData.getAll("variantMl") as string[];
  const variantPrices = formData.getAll("variantPrice") as string[];
  const variantStocks = formData.getAll("variantStock") as string[];

  const variants = variantLabels
    .map((label, i) => ({
      product_id: product.id,
      label,
      ml: Number(variantMls[i] ?? 0),
      price: Number(variantPrices[i] ?? 0),
      stock: Number(variantStocks[i] ?? 0),
    }))
    .filter((v) => v.label.trim().length > 0);

  if (variants.length > 0) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(variants);
    if (variantError) {
      return { error: variantError.message };
    }
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const scentNotes = String(formData.get("scentNotes") ?? "");
  const isActive = formData.get("isActive") === "on";

  const update: Record<string, unknown> = {
    name,
    description,
    scent_notes: scentNotes,
    is_active: isActive,
  };

  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const extension = imageFile.name.split(".").pop() || "jpg";
    const path = `${productId}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, imageFile, { contentType: imageFile.type, upsert: false });

    if (uploadError) {
      return { error: `Product photo didn't upload: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);
    update.image_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from("products")
    .update(update)
    .eq("id", productId);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    return {
      error:
        "Couldn't delete — this product has order or review history. Hide it instead by turning off \"Active\".",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateVariant(variantId: string, formData: FormData) {
  const supabase = await createClient();

  const label = String(formData.get("label") ?? "").trim();
  const ml = Number(formData.get("ml") ?? 0);
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);

  const { error } = await supabase
    .from("product_variants")
    .update({ label, ml, price, stock })
    .eq("id", variantId);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function addVariant(productId: string, formData: FormData) {
  const supabase = await createClient();

  const label = String(formData.get("label") ?? "").trim();
  const ml = Number(formData.get("ml") ?? 0);
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);

  if (!label) return { error: "Enter a size label." };

  const { error } = await supabase
    .from("product_variants")
    .insert({ product_id: productId, label, ml, price, stock });

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteVariant(variantId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variantId);

  if (error) {
    return {
      error:
        "Couldn't delete — this size has order history. Set its stock to 0 instead.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}
export async function approveReview(reviewId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: true })
    .eq("id", reviewId);
  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
  return { success: true };
}

export async function rejectReview(reviewId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function recordManualSale(formData: FormData) {
  const supabase = await createClient();
  const variantId = String(formData.get("variantId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);
  const customerName = String(formData.get("customerName") ?? "Walk-in customer");

  if (!variantId || quantity <= 0) {
    return { error: "Select a product variant and a valid quantity." };
  }

  const { data: variant, error: variantError } = await supabase
    .from("product_variants")
    .select("id, price, stock, label, product_id, products(name)")
    .eq("id", variantId)
    .single();

  if (variantError || !variant) {
    return { error: "Could not find that product variant." };
  }

  const orderCode = `LU-M${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_code: orderCode,
      customer_name: customerName,
      customer_phone: "N/A",
      status: "fulfilled",
      source: "manual",
      total: variant.price * quantity,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Could not record the sale." };
  }

  const productName =
    (variant.products as unknown as { name: string } | null)?.name ??
    "Product";

  await supabase.from("order_items").insert({
    order_id: order.id,
    product_variant_id: variant.id,
    product_name: productName,
    variant_label: variant.label,
    unit_price: variant.price,
    quantity,
  });

  await supabase.from("stock_movements").insert({
    product_variant_id: variant.id,
    change: -quantity,
    reason: "manual_sale",
    order_id: order.id,
  });

  await supabase
    .from("product_variants")
    .update({ stock: Math.max(0, variant.stock - quantity) })
    .eq("id", variant.id);

  await notifyAdmins({
    title: "Sale recorded",
    body: `${orderCode}: ${productName} (${variant.label}) x${quantity} — KSh ${variant.price * quantity}`,
    url: "/admin/orders",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  redirect("/admin/sales/new?recorded=" + orderCode);
}