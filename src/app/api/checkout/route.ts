import { NextResponse } from "next/server";
import { DELIVERY_FEES, type DeliveryZone } from "@/lib/delivery";

type CheckoutItem = {
  variantId: string;
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
};

type CheckoutPayload = {
  customerName: string;
  customerPhone: string;
  deliveryZone: DeliveryZone;
  deliveryAddress: string;
  items: CheckoutItem[];
};

function generateOrderCode() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `LU-${n}`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutPayload;

  if (
    !body.customerName?.trim() ||
    !body.customerPhone?.trim() ||
    !body.deliveryZone ||
    !body.deliveryAddress?.trim() ||
    !body.items?.length
  ) {
    return NextResponse.json(
      { error: "Missing required checkout details." },
      { status: 400 }
    );
  }

  const deliveryFee = DELIVERY_FEES[body.deliveryZone];
  const itemsTotal = body.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = itemsTotal + deliveryFee;
  const orderCode = generateOrderCode();

  const payHeroConfigured =
    !!process.env.PAYHERO_API_USERNAME &&
    !!process.env.PAYHERO_API_PASSWORD &&
    !!process.env.PAYHERO_CHANNEL_ID;

  // TODO once the Pay Hero key is available: persist this order to
  // Supabase (status "pending"), then call Pay Hero's STK push endpoint
  // with `total` and `customerPhone`, and return the checkout request ID
  // so the client can poll or the webhook can update the order to "paid".
  if (!payHeroConfigured) {
    return NextResponse.json({
      status: "pending_payhero_setup",
      orderCode,
      total,
      deliveryFee,
      message:
        "Order details captured. M-Pesa payment isn't wired up yet — add the Pay Hero credentials to enable checkout.",
    });
  }

  // Placeholder for when credentials are added.
  return NextResponse.json({
    status: "stk_push_pending",
    orderCode,
    total,
    deliveryFee,
  });
}
