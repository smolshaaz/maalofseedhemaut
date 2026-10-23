"use client";

import { useEffect, useState } from "react";
import { formatPrice, isSoldOut, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ArrowIcon } from "./Icons";

const Check = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" style={{ strokeDasharray: 24, strokeDashoffset: 0, animation: "draw 420ms var(--ease-out) both" }} />
  </svg>
);

export function BuyBox({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add, lines, setOpen } = useCart();
  const inBag = lines.filter((l) => l.handle === product.handle).reduce((n, l) => n + l.qty, 0);
  const multi = product.variants.length > 1;
  const [variantId, setVariantId] = useState<number | null>(multi ? null : product.variants[0].id);
  const [added, setAdded] = useState(0);
  const [nudge, setNudge] = useState(0);
  const soldOut = isSoldOut(product);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(0), 1600);
    return () => window.clearTimeout(t);
  }, [added]);

  const onBuy = () => {
    if (soldOut) return;
    // No size yet: shake the sizes instead of greying the button out.
    if (variantId === null) return setNudge((n) => n + 1);
    add(product.handle, variantId);
    setAdded((a) => a + 1);
  };

  return (
    <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-3"}`}>
      {multi && (
        <div key={nudge || "sizes"} role="radiogroup" aria-label="Size" className="flex flex-wrap gap-1.5" style={nudge ? { animation: "nudge 420ms var(--ease-out)" } : undefined}>
          {product.variants.map((v) => {
            const on = v.id === variantId;
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={!v.available}
                onClick={() => {
                  setVariantId(v.id);
                  setNudge(0);
                }}
                className={`${compact ? "h-8 min-w-10 text-[12.5px]" : "h-9 min-w-11 text-[13px]"} rounded-full px-3 font-semibold transition-[background-color,color,transform] duration-300 [transition-timing-function:var(--spring-bouncy)] active:scale-90 disabled:cursor-not-allowed disabled:line-through disabled:opacity-35 ${
                  on ? "scale-105 bg-ink text-paper" : nudge ? "bg-red/10 hover:bg-ink/[0.12]" : "bg-ink/[0.06] hover:bg-ink/[0.12]"
                }`}
              >
                {v.title}
              </button>
            );
          })}
        </div>
      )}
      <button
        type="button"
        disabled={soldOut}
        onClick={onBuy}
        className={`relative flex ${compact ? "h-11" : "h-12"} items-center justify-between overflow-hidden rounded-full pl-5 pr-1.5 text-[15px] font-semibold transition-[transform,background-color] duration-300 active:scale-[0.97] disabled:cursor-not-allowed ${
          added ? "bg-red text-white" : "bg-ink text-paper disabled:bg-ink/35"
        }`}
      >
        <span key={added ? "added" : "idle"} className="flex items-center gap-2" style={{ animation: "rise 380ms var(--spring-soft) both" }}>
          {soldOut ? "Sold out" : added ? (
            <>
              <Check /> Added to bag
            </>
          ) : variantId === null ? (
            "Pick a size"
          ) : (
            "Add to bag"
          )}
        </span>
        <span className={`flex ${compact ? "h-8" : "h-9"} items-center rounded-full bg-white/15 px-3.5 text-[14px] tabular-nums`}>
          {product.compareAt && <s className="mr-2 opacity-50">{formatPrice(product.compareAt)}</s>}
          {formatPrice(product.price)}
        </span>
      </button>
      {inBag > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="-mt-0.5 flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-ink/60 transition-colors hover:text-ink"
          style={{ animation: "rise 500ms var(--spring-soft) both" }}
        >
          <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red px-1 text-[10.5px] tabular-nums text-white">{inBag}</span>
          in your bag · View bag
          <ArrowIcon className="size-3" />
        </button>
      )}
    </div>
  );
}
