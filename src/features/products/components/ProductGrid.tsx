import { ProductCard } from "@/features/products/components/ProductCard";
import type { Product } from "@/features/products/types";

// Roughly the first row on desktop; these images are likely above the fold.
const EAGER_IMAGE_COUNT = 5;

export const PRODUCT_GRID_CLASS_NAME =
  "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className={PRODUCT_GRID_CLASS_NAME}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            loadImageEagerly={index < EAGER_IMAGE_COUNT}
          />
        </li>
      ))}
    </ul>
  );
}
