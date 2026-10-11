const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(amount: number): string {
  return usdFormatter.format(amount);
}

/** Price before the discount was applied, e.g. 90 at 10% off → 100. */
export function priceBeforeDiscount(
  price: number,
  discountPercentage: number,
): number {
  return price / (1 - discountPercentage / 100);
}
