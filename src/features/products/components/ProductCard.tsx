import Image from "next/image";
import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCategoryName } from "@/features/products/lib/catalog-facets";
import {
  formatPrice,
  priceBeforeDiscount,
} from "@/features/products/lib/format-price";
import type { Product } from "@/features/products/types";

const MIN_DISPLAYED_DISCOUNT = 1;
const LOW_STOCK_THRESHOLD = 10;

// Matches the grid in ProductGrid: 2 → 3 → 4 columns next to the filter sidebar.
const PRODUCT_IMAGE_SIZES =
  "(min-width: 1280px) 240px, (min-width: 768px) 30vw, 50vw";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <Badge variant="destructive">Out of stock</Badge>;
  }
  if (stock < LOW_STOCK_THRESHOLD) {
    return <Badge variant="secondary">Only {stock} left</Badge>;
  }
  return null;
}

export function ProductCard({
  product,
  loadImageEagerly = false,
}: {
  product: Product;
  loadImageEagerly?: boolean;
}) {
  const hasDiscount = product.discountPercentage >= MIN_DISPLAYED_DISCOUNT;

  return (
    <article className="group flex h-full flex-col gap-3 rounded-2xl bg-card p-2.5 text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/20 sm:p-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes={PRODUCT_IMAGE_SIZES}
          loading={loadImageEagerly ? "eager" : "lazy"}
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <Badge className="absolute top-2 left-2">
            −{Math.round(product.discountPercentage)}%
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-1 pb-1">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate">{formatCategoryName(product.category)}</span>
          <span
            className="flex shrink-0 items-center gap-1"
            aria-label={`Rated ${product.rating.toFixed(1)} out of 5`}
          >
            <StarIcon className="size-3.5 fill-current text-amber-500" aria-hidden />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <h3 className="line-clamp-2 text-sm leading-snug font-medium">
          {product.title}
        </h3>
        {product.brand && (
          <p className="truncate text-xs text-muted-foreground">{product.brand}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
          <span className="text-base font-semibold tracking-tight">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(
                priceBeforeDiscount(product.price, product.discountPercentage),
              )}
            </span>
          )}
          <StockBadge stock={product.stock} />
        </div>
      </div>
    </article>
  );
}
