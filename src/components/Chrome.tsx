"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice, LOGO, productByHandle, STORE_ORIGIN } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ArrowIcon, BagIcon, CloseIcon, MenuIcon, MinusIcon, PlusIcon } from "./Icons";
import { useProductSheet } from "./ProductSheet";

export function Mark({ invert = false, className = "size-9" }: { invert?: boolean; className?: string }) {
  return (
    <Image
      src={LOGO}
      alt="Seedhe Maut"
      width={72}
      height={72}
      priority
      className={`${className} object-contain ${invert ? "invert" : ""}`}
    />
  );
}

// "blend" keeps the mark legible over both the dark hero and the light page below it.
// Sits in a glass pill by default so it stays legible over the wall, coloured fields and the black footer.
export function TopLogo({ tone: toneProp = "ink", blend = false, glass = true }: { tone?: "ink" | "paper"; blend?: boolean; glass?: boolean }) {
  const tone = glass ? "ink" : toneProp;
  return (
    <Link
      href="/"
      aria-label="MAAL, back to the wall"
      className={`fixed left-4 top-4 z-40 flex items-center gap-2 sm:left-6 sm:top-5 ${blend && !glass ? "mix-blend-difference" : ""} ${glass ? "glass rounded-full py-1 pl-1.5 pr-3.5" : ""}`}
    >
      <Mark invert={tone === "paper"} className="size-8 sm:size-9" />
      <span className={`display text-[19px] tracking-tight sm:text-[21px] ${tone === "paper" ? "text-paper" : "text-ink"}`}>Maal</span>
    </Link>
  );
}

const NAV = [
  { href: "/", label: "Wall" },
  { href: "/shop", label: "Index" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Dock() {
  const [menu, setMenu] = useState(false);
  const { count, setOpen } = useCart();
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6">
      <div className="pointer-events-auto flex items-center gap-1.5">
        {menu ? (
          <>
            <button
              type="button"
              onClick={() => setMenu(false)}
              aria-label="Close menu"
              className="glass-dark grid size-11 place-items-center rounded-full transition-transform active:scale-90"
              style={{ animation: "pop-in 500ms var(--spring-bouncy) both" }}
            >
              <CloseIcon />
            </button>
            <div className="glass hide-scrollbar flex max-w-[calc(100vw-5.5rem)] items-center gap-1 overflow-x-auto rounded-full p-1">
              {NAV.map((n, i) => {
                const on = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={on ? "page" : undefined}
                    onClick={() => setMenu(false)}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${on ? "bg-ink text-paper" : "hover:bg-ink/[0.07]"}`}
                    style={{ animation: `pop-in 560ms var(--spring-bouncy) ${i * 45}ms both` }}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="glass flex items-center gap-1 rounded-full p-1" style={{ animation: "pop-in 500ms var(--spring-bouncy) both" }}>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-expanded={menu}
              className="flex h-10 items-center gap-2 rounded-full bg-ink pl-3.5 pr-4 text-[13px] font-semibold text-paper transition-transform active:scale-95"
            >
              <MenuIcon className="size-4" /> Menu
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition-colors hover:bg-ink/[0.07]"
              aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <BagIcon className="size-4" /> Bag
              <span
                key={count}
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] tabular-nums ${count ? "bump bg-red text-white" : "bg-ink/10"}`}
              >
                {count}
              </span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

// Confirms an add without pulling the visitor away from the wall.
export function AddedToast() {
  const { lastAdded, setOpen } = useCart();
  // Inside the product sheet the buy card confirms it; a toast there would cover the close button.
  const { current: sheetOpen } = useProductSheet();
  const [shown, setShown] = useState<NonNullable<typeof lastAdded> | null>(null);

  useEffect(() => {
    if (!lastAdded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirror the latest add into a timed toast
    setShown(lastAdded);
    const t = window.setTimeout(() => setShown(null), 2800);
    return () => window.clearTimeout(t);
  }, [lastAdded]);

  if (!shown || sheetOpen) return null;
  const p = productByHandle.get(shown.handle);
  const v = p?.variants.find((x) => x.id === shown.variantId);
  if (!p || !v) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex justify-center px-3" role="status">
      <div
        key={shown.at}
        className="glass pointer-events-auto flex w-full max-w-[380px] items-center gap-3 rounded-[20px] !bg-[rgba(250,250,248,0.9)] p-2 pr-2.5"
        style={{ animation: "toast-in 600ms var(--spring-bouncy) both" }}
      >
        <div className="polaroid w-11 shrink-0 -rotate-3 !p-[5px] !pb-2">
          <div className="polaroid-plate">
            <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red">Added to bag</p>
          <p className="truncate text-[13px] font-semibold">
            {p.title}
            {v.title !== "One size" && <span className="font-normal text-ink/55"> · {v.title}</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShown(null);
            setOpen(true);
          }}
          className="h-9 shrink-0 rounded-full bg-ink px-3.5 text-[12.5px] font-semibold text-paper transition-transform active:scale-95"
        >
          View bag
        </button>
      </div>
    </div>
  );
}

export function BagSheet() {
  const { lines, subtotal, open, setOpen, setQty, checkoutUrl } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close bag"
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink/25 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Bag"
        className={`glass absolute bottom-2 left-2 right-2 flex max-h-[82dvh] flex-col rounded-[26px] transition-transform duration-700 [transition-timing-function:var(--spring-soft)] sm:bottom-3 sm:left-auto sm:right-3 sm:top-3 sm:max-h-none sm:w-[400px] ${
          open ? "translate-y-0 sm:translate-x-0" : "translate-y-[110%] sm:translate-x-[110%] sm:translate-y-0"
        }`}
      >
        <header className="flex items-center justify-between px-5 pb-2 pt-5">
          <h2 className="display text-[26px]">Bag</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close bag" className="grid size-9 place-items-center rounded-full bg-ink/[0.06] hover:bg-ink/[0.12]">
            <CloseIcon />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start gap-4 px-5 pb-6 pt-2">
            <p className="text-[15px] text-ink/70">Your bag is empty. The wall isn&apos;t.</p>
            <Link href="/" onClick={() => setOpen(false)} className="flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-paper">
              Back to the wall <ArrowIcon />
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-2">
              {lines.map((l, i) => {
                const p = productByHandle.get(l.handle);
                const v = p?.variants.find((x) => x.id === l.variantId);
                if (!p || !v) return null;
                return (
                  <li key={l.variantId} className="flex gap-3" style={open ? { animation: `rise 600ms var(--spring-soft) ${120 + i * 50}ms both` } : undefined}>
                    <div className="polaroid w-[72px] shrink-0 !p-1 !pb-2">
                      <div className="polaroid-plate">
                        <Image src={p.images[0]} alt="" fill sizes="72px" className="object-cover" />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="display text-[14px] leading-tight">{p.title}</p>
                      <p className="mt-0.5 text-[12px] text-ink/60">{v.title === "One size" ? p.type : `Size ${v.title}`}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full bg-ink/[0.06]">
                          <button type="button" aria-label="Remove one" onClick={() => setQty(l.variantId, l.qty - 1)} className="grid size-8 place-items-center">
                            <MinusIcon className="size-3.5" />
                          </button>
                          <span className="w-5 text-center text-[13px] tabular-nums">{l.qty}</span>
                          <button type="button" aria-label="Add one" onClick={() => setQty(l.variantId, l.qty + 1)} className="grid size-8 place-items-center">
                            <PlusIcon className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-[14px] font-semibold tabular-nums">{formatPrice(p.price * l.qty)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <footer className="border-t border-ink/10 px-5 pb-5 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-ink/60">Subtotal</span>
                <span className="text-[18px] font-semibold tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <a
                href={checkoutUrl}
                rel="noopener"
                className="mt-3 flex h-12 items-center justify-between rounded-full bg-ink pl-5 pr-2 text-[15px] font-semibold text-paper transition-transform active:scale-[0.98]"
              >
                Checkout
                <span className="grid size-9 place-items-center rounded-full bg-white/15">
                  <ArrowIcon />
                </span>
              </a>
              <p className="mt-2.5 text-[11.5px] leading-snug text-ink/55">
                Shipping and taxes at checkout. Payment is handled by the official store at {STORE_ORIGIN.replace("https://", "")}.
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
