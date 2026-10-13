import { Badge } from "@/components/ui/badge";
import { LOW_STOCK_THRESHOLD } from "@/features/products/lib/product-display";

export function ProductStockBadge({
  stock,
  hideWhenInStock = false,
}: {
  stock: number;
  /** On cards, only out-of-stock and low-stock are worth calling out. */
  hideWhenInStock?: boolean;
}) {
  if (stock === 0) {
    return <Badge variant="destructive">Out of stock</Badge>;
  }
  if (stock < LOW_STOCK_THRESHOLD) {
    return <Badge variant="secondary">Only {stock} left</Badge>;
  }
  if (hideWhenInStock) return null;
  return <Badge variant="secondary">In stock · {stock} available</Badge>;
}
