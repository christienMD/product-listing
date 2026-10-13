import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BackToProductsLink } from "@/features/products/components/details/BackToProductsLink";
import { ProductImageGallery } from "@/features/products/components/details/ProductImageGallery";
import { ProductReviews } from "@/features/products/components/details/ProductReviews";
import { ProductSpecs } from "@/features/products/components/details/ProductSpecs";
import { RatingStars } from "@/features/products/components/details/RatingStars";
import { ProductStockBadge } from "@/features/products/components/ProductStockBadge";
import { formatCategoryName } from "@/features/products/lib/catalog-facets";
import {
  formatPrice,
  priceBeforeDiscount,
} from "@/features/products/lib/format-price";
import { MIN_DISPLAYED_DISCOUNT } from "@/features/products/lib/product-display";
import { toProductSearchParams, DEFAULT_PRODUCT_QUERY } from "@/features/products/lib/product-query-params";
import type { ProductDetails } from "@/features/products/types";

function categoryListingHref(category: string): string {
  return `/?${toProductSearchParams({ ...DEFAULT_PRODUCT_QUERY, category })}`;
}

export function ProductDetailsView({ product }: { product: ProductDetails }) {
  const hasDiscount = product.discountPercentage >= MIN_DISPLAYED_DISCOUNT;

  return (
    <div className="flex flex-col gap-6">
      <BackToProductsLink />

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <ProductImageGallery images={product.images} productTitle={product.title} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
              <Link
                href={categoryListingHref(product.category)}
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {formatCategoryName(product.category)}
              </Link>
              {product.brand && (
                <>
                  <span aria-hidden>·</span>
                  <span>{product.brand}</span>
                </>
              )}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RatingStars rating={product.rating} />
              <span>
                {product.rating.toFixed(1)} · {product.reviews.length} reviews
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-3xl font-semibold tracking-tight">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-muted-foreground line-through">
                  {formatPrice(
                    priceBeforeDiscount(product.price, product.discountPercentage),
                  )}
                </span>
                <Badge>−{Math.round(product.discountPercentage)}%</Badge>
              </>
            )}
            <ProductStockBadge stock={product.stock} />
          </div>

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          {product.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
              {product.tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="outline">{tag}</Badge>
                </li>
              ))}
            </ul>
          )}

          <ProductSpecs product={product} />
        </div>
      </div>

      <ProductReviews reviews={product.reviews} />
    </div>
  );
}
