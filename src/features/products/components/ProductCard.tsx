import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductStockBadge } from "@/features/products/components/ProductStockBadge";
import { formatCategoryName } from "@/features/products/lib/catalog-facets";
import {
  formatPrice,
  priceBeforeDiscount,
} from "@/features/products/lib/format-price";
import { MIN_DISPLAYED_DISCOUNT, productDetailsHref } from "@/features/products/lib/product-display";
import type { Product } from "@/features/products/types";

// Matches the grid in ProductGrid: 2 → 3 → 4 → 5 columns next to the filter sidebar.
const PRODUCT_IMAGE_SIZES =
  "(min-width: 1536px) 240px, (min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw";

export function ProductCard({
  product,
  loadImageEagerly = false,
}: {
  product: Product;
  loadImageEagerly?: boolean;
}) {
  const hasDiscount = product.discountPercentage >= MIN_DISPLAYED_DISCOUNT;

  return (
    // The title link is stretched over the whole card (after:inset-0), so the
    // card is clickable while screen readers announce just the product name.
    <article className="group relative flex h-full flex-col gap-2.5 rounded-2xl bg-card p-2 text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/25 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={product.thumbnail}
          alt=""
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

      <div className="flex flex-1 flex-col gap-1 px-1 pb-1">
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
          <Link
            href={productDetailsHref(product.id)}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl"
          >
            {product.title}
          </Link>
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
          <ProductStockBadge stock={product.stock} hideWhenInStock />
        </div>
      </div>
    </article>
  );
}
