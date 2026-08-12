export type DeliveryZone = "cbd" | "outskirts";

// Placeholder fees — adjust these to your real rates.
export const DELIVERY_FEES: Record<DeliveryZone, number> = {
  cbd: 150,
  outskirts: 250,
};

export const DELIVERY_ZONE_LABELS: Record<DeliveryZone, string> = {
  cbd: "Nairobi CBD",
  outskirts: "Nairobi outskirts",
};
