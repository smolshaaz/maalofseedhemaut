"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { productByHandle, type Product } from "@/data/products";
import { EASE_IN_OUT, prefersReducedMotion, SPRING_SOFT } from "@/lib/motion";
import { BuyBox } from "./BuyBox";
import { ArrowIcon, CloseIcon, GridIcon } from "./Icons";
import { PhotoStack } from "./PhotoStack";

type SheetApi = { openProduct: (handle: string, origin?: HTMLElement | null) => void; close: () => void; current: Product | null };
const SheetContext = createContext<SheetApi | null>(null);

export function useProductSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useProductSheet must be used inside ProductSheetProvider");
  return ctx;
}

type Open = { product: Product; origin: HTMLElement | null };

export function ProductSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<Open | null>(null);
  const pushed = useRef(false);
  const router = useRouter();

  const openProduct = useCallback((handle: string, origin: HTMLElement | null = null) => {
    const product = productByHandle.get(handle);
    if (!product) return;
    setOpen({ product, origin });
    // Give the open sheet a shareable address without leaving the page underneath.
    const state = { ...window.history.state, maalSheet: handle };
    if (!pushed.current) window.history.pushState(state, "", `/product/${handle}`);
    else window.history.replaceState(state, "", `/product/${handle}`);
    pushed.current = true;
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    }
  }, []);

  // Leave the overlay for the full product page, reusing the history entry the sheet created.
  const toPage = useCallback(
    (handle: string) => {
      pushed.current = false;
      setOpen(null);
      router.replace(`/product/${handle}`);
    },
    [router],
  );

  useEffect(() => {
    const onPop = () => {
      if (pushed.current) {
        pushed.current = false;
        setOpen(null);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const api = useMemo(() => ({ openProduct, close, current: open?.product ?? null }), [openProduct, close, open]);

  return (
    <SheetContext.Provider value={api}>
      {children}
      {open && <Sheet key={open.product.handle} product={open.product} origin={open.origin} onClose={close} onDetails={toPage} />}
    </SheetContext.Provider>
  );
}

// The transform that puts `el` exactly over `from`, for a FLIP flight.
function flightFrom(from: DOMRect, el: HTMLElement) {
  const to = el.getBoundingClientRect();
  const s = from.width / to.width;
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  return `translate3d(${dx}px, ${dy}px, 0) scale(${s})`;
}

const onScreen = (r: DOMRect) => r.width > 0 && r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;

function Sheet({ product, origin, onClose, onDetails }: { product: Product; origin: HTMLElement | null; onClose: () => void; onDetails: (handle: string) => void }) {
  const stack = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);
  const n = product.images.length;

  // Lift the print off the wall: the stack starts exactly over the card that was tapped.
  useLayoutEffect(() => {
    const el = stack.current;
    const from = origin?.getBoundingClientRect();
    if (!el || !origin || !from || !onScreen(from)) return;
    origin.style.visibility = "hidden";
    if (!prefersReducedMotion()) el.animate([{ transform: flightFrom(from, el) }, { transform: "none" }], { duration: 760, easing: SPRING_SOFT, fill: "backwards" });
    return () => {
      origin.style.visibility = "";
    };
  }, [origin]);

  const dismiss = useCallback(() => {
    if (closing) return;
    setClosing(true);
    const el = stack.current;
    const from = origin?.isConnected ? origin.getBoundingClientRect() : null;
    // Put it back where it came from, if that spot is still on screen.
    if (el && from && onScreen(from) && !prefersReducedMotion()) {
      const a = el.animate([{ transform: "none" }, { transform: flightFrom(from, el) }], { duration: 440, easing: EASE_IN_OUT, fill: "forwards" });
      a.onfinish = onClose;
    } else {
      window.setTimeout(onClose, 240);
    }
  }, [closing, onClose, origin]);

  useEffect(() => {
    closeBtn.current?.focus({ preventScroll: true });
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [dismiss]);

  const chrome = (delay: number): React.CSSProperties =>
    closing
      ? { opacity: 0, transform: "translate3d(0, 12px, 0)", transition: "opacity 200ms ease, transform 220ms ease" }
      : { animation: `rise 700ms var(--spring-soft) ${delay}ms both` };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-title" className="fixed inset-0 z-50">
      <button type="button" aria-label="Close" tabIndex={-1} onClick={dismiss} className="sheet-backdrop fixed inset-0 cursor-default" data-closing={closing || undefined} />

      {/* One screen, no scrolling: the photo stack shrinks to whatever room the buy card leaves. */}
      <div className="pointer-events-none relative mx-auto flex h-dvh w-full max-w-[480px] flex-col px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-[max(14px,env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex items-center justify-between" style={chrome(80)}>
          <button ref={closeBtn} type="button" onClick={dismiss} aria-label="Close" className="glass grid size-10 place-items-center rounded-full transition-transform active:scale-90">
            <CloseIcon />
          </button>
          <span className="glass flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold">
            <GridIcon />
            {n} {n === 1 ? "Photo" : "Photos"}
          </span>
        </div>

        <div className="grid min-h-0 flex-1 place-items-center py-4 [container-type:size]">
          <div className="pointer-events-auto" style={{ width: "min(88cqw, calc((100cqh - 28px) * 0.86))" }}>
            <PhotoStack stackRef={stack} images={product.images} alt={product.title} priority collapsed={!!origin} sizes="(max-width: 640px) 88vw, 420px" />
          </div>
        </div>

        <div className="glass pointer-events-auto relative shrink-0 rounded-[22px] !bg-[rgba(250,250,248,0.86)] p-4" style={chrome(160)}>
          <div className="flex items-start justify-between gap-3">
            <h2 id="sheet-title" className="display text-[clamp(18px,5.2vw,24px)] leading-[1.02]">
              {product.title}
            </h2>
            <button
              type="button"
              onClick={() => onDetails(product.handle)}
              className="-mr-1 -mt-0.5 flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[12px] font-semibold text-ink/55 transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              Details <ArrowIcon className="size-3" />
            </button>
          </div>
          <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-snug text-ink/65">{product.short}</p>
          <div className="mt-3">
            <BuyBox product={product} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
