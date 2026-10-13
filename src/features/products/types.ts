export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string | null;
  thumbnail: string;
  tags: string[];
  availabilityStatus: string;
};

export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

/** A product with everything the details page shows. */
export type ProductDetails = Product & {
  images: string[];
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  reviews: ProductReview[];
};

export type ProductSort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "title-asc";

/** Everything the listing can be narrowed or ordered by; parsed from the URL. */
export type ProductQuery = {
  search: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  inStockOnly: boolean;
  sort: ProductSort;
  page: number;
};

export type ProductPage = {
  products: Product[];
  totalMatches: number;
  page: number;
  pageCount: number;
};

export type CategoryFacet = {
  slug: string;
  name: string;
  productCount: number;
};

export type CatalogFacets = {
  categories: CategoryFacet[];
  priceRange: { min: number; max: number };
};
