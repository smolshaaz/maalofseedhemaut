"use client";

import { useState } from "react";
import { collections, products, type CollectionHandle } from "@/data/products";
import { ProductCard } from "./ProductCard";

const SORTS = {
  wall: { label: "As hung", fn: () => 0 },
  low: { label: "Price, low", fn: (a: { price: number }, b: { price: number }) => a.price - b.price },
  high: { label: "Price, high", fn: (a: { price: number }, b: { price: number }) => b.price - a.price },
} as const;

export function ShopIndex() {
  const [filter, setFilter] = useState<CollectionHandle | "all">("all");
  const [sort, setSort] = useState<keyof typeof SORTS>("wall");
  const list = products.filter((p) => filter === "all" || p.collections.includes(filter)).sort(SORTS[sort].fn);

  return (
    <>
      {/* Sticks just below the logo pill so the two never overlap. */}
      <div className="sticky top-[68px] z-20 mt-10 flex flex-wrap items-center justify-between gap-2 sm:top-[76px]">
        <div role="radiogroup" aria-label="Collection" className="glass hide-scrollbar flex max-w-full gap-0.5 overflow-x-auto rounded-full p-1">
          {(["all", ...collections.map((c) => c.handle)] as const).map((h) => (
            <button
              key={h}
              type="button"
              role="radio"
              aria-checked={filter === h}
              onClick={() => setFilter(h)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${filter === h ? "bg-ink text-paper" : "hover:bg-ink/[0.07]"}`}
            >
              {h === "all" ? "All" : collections.find((c) => c.handle === h)!.title}
            </button>
          ))}
        </div>
        <div role="radiogroup" aria-label="Sort" className="glass flex gap-0.5 rounded-full p-1">
          {(Object.keys(SORTS) as (keyof typeof SORTS)[]).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={sort === k}
              onClick={() => setSort(k)}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${sort === k ? "bg-ink text-paper" : "hover:bg-ink/[0.07]"}`}
            >
              {SORTS[k].label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-[13px] text-ink/55" aria-live="polite">
        {list.length} pieces
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
        {list.map((p, i) => (
          <li key={`${filter}:${sort}:${p.handle}`} className="pin-in" style={{ animationDelay: `${Math.min(i, 14) * 40}ms` }}>
            <ProductCard product={p} tilt={((i * 7) % 5) * 0.35 - 0.7} />
          </li>
        ))}
      </ul>
    </>
  );
}
