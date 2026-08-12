import type { Metadata } from "next";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | LUÀN",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
