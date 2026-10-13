import type { ProductDetails } from "@/features/products/types";

// DummyJSON does not state units for weight or dimensions, so none are shown.
function formatDimensions({ width, height, depth }: ProductDetails["dimensions"]) {
  return `${width} × ${height} × ${depth} (W × H × D)`;
}

function formatUnits(count: number) {
  return `${count} ${count === 1 ? "unit" : "units"}`;
}

export function ProductSpecs({ product }: { product: ProductDetails }) {
  const specs: { label: string; value: string }[] = [
    { label: "SKU", value: product.sku },
    { label: "Weight", value: String(product.weight) },
    { label: "Dimensions", value: formatDimensions(product.dimensions) },
    { label: "Warranty", value: product.warrantyInformation },
    { label: "Shipping", value: product.shippingInformation },
    { label: "Returns", value: product.returnPolicy },
    { label: "Minimum order", value: formatUnits(product.minimumOrderQuantity) },
  ];

  return (
    <section className="rounded-2xl ring-1 ring-foreground/10">
      <h2 className="border-b px-4 py-3 text-sm font-medium">Specifications</h2>
      <dl className="divide-y text-sm">
        {specs.map((spec) => (
          <div key={spec.label} className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-2.5">
            <dt className="text-muted-foreground">{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
