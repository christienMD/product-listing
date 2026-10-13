/** Discounts below this are too small to badge. */
export const MIN_DISPLAYED_DISCOUNT = 1;

export const LOW_STOCK_THRESHOLD = 10;

export function productDetailsHref(productId: number): string {
  return `/products/${productId}`;
}
