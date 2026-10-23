"use client";

import Image from "next/image";
import { formatPrice, isSoldOut, type Product } from "@/data/products";
import { useProductSheet } from "./ProductSheet";

// A polaroid that opens the reel-style sheet; still a real link without script.
export function ProductCard({ product, tilt = 0, caption = true, tone = "ink", sizes = "(max-width: 640px) 45vw, 260px" }: {
  product: Product;
  tilt?: number;
  caption?: boolean;
  tone?: "ink" | "paper";
  sizes?: string;
}) {
  const { openProduct } = useProductSheet();
  return (
    <a
      href={`/product/${product.handle}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        openProduct(product.handle, e.currentTarget.querySelector<HTMLElement>(".polaroid"));
      }}
      className="group block"
    >
      <div
        className="wall-card polaroid"
        style={{ ["--rot" as string]: `${tilt}deg` }}
      >
        <div className="polaroid-plate">
          <Image src={product.images[0]} alt={product.title} fill sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          {isSoldOut(product) && (
            <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper">Sold out</span>
          )}
        </div>
        <div className="h-[11%] min-h-4" />
      </div>
      {caption && (
        <div className={`mt-3 flex items-start justify-between gap-3 px-0.5 ${tone === "paper" ? "text-paper" : "text-ink"}`}>
          <span className="display text-[13px] leading-[1.1] sm:text-[14px]">{product.title}</span>
          <span className="shrink-0 text-[12.5px] tabular-nums opacity-70">
            {product.compareAt && <s className="mr-1.5 opacity-60">{formatPrice(product.compareAt)}</s>}
            {formatPrice(product.price)}
          </span>
        </div>
      )}
    </a>
  );
}
