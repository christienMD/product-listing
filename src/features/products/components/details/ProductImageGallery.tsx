"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "cn";

export function ProductImageGallery({
  images,
  productTitle,
}: {
  images: string[];
  productTitle: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={images[selectedIndex]}
          alt={`${productTitle}, image ${selectedIndex + 1} of ${images.length}`}
          fill
          preload={selectedIndex === 0}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-contain p-6"
        />
      </div>

      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2" aria-label="Product images">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-pressed={index === selectedIndex}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 transition outline-none hover:ring-foreground/30 focus-visible:ring-3 focus-visible:ring-ring/50",
                  index === selectedIndex && "ring-2 ring-foreground hover:ring-foreground",
                )}
              >
                <Image src={image} alt="" fill sizes="64px" className="object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
