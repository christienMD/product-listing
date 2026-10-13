import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import {
  getAllProductIds,
  getProductDetails,
} from "@/features/products/api/get-product-details";
import { ProductDetailsView } from "@/features/products/components/details/ProductDetailsView";

// Every product page is prerendered at build time from the cached catalog.
export async function generateStaticParams() {
  const productIds = await getAllProductIds();
  return productIds.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductDetails(id);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.description };
}

export default async function ProductDetailsPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProductDetails(id);
  if (!product) notFound();

  return (
    <PageContainer className="py-6">
      <ProductDetailsView product={product} />
    </PageContainer>
  );
}
