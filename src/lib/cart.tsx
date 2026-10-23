"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { productByHandle, STORE_ORIGIN } from "@/data/products";

export type CartLine = { handle: string; variantId: number; qty: number };

type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (handle: string, variantId: number) => void;
  setQty: (variantId: number, qty: number) => void;
  checkoutUrl: string;
  lastAdded: { handle: string; variantId: number; at: number } | null;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "maal.bag.v1";
const MAX_QTY = 10;

// Only accept lines that still match the catalogue, so a tampered or stale
// localStorage value can never put an unknown id into the checkout URL.
function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((l) => {
    if (!l || typeof l !== "object") return [];
    const { handle, variantId, qty } = l as Record<string, unknown>;
    if (typeof handle !== "string" || typeof variantId !== "number" || typeof qty !== "number") return [];
    const product = productByHandle.get(handle);
    const variant = product?.variants.find((v) => v.id === variantId && v.available);
    if (!variant) return [];
    return [{ handle, variantId, qty: Math.max(1, Math.min(MAX_QTY, Math.floor(qty))) }];
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartState["lastAdded"]>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setLines(sanitize(JSON.parse(saved)));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const add = useCallback((handle: string, variantId: number) => {
    setLines((prev) => {
      const hit = prev.find((l) => l.variantId === variantId);
      if (hit) return prev.map((l) => (l === hit ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l));
      return [...prev, { handle, variantId, qty: 1 }];
    });
    // Confirm in place (toast + bag bump) rather than throwing the drawer open mid-browse.
    setLastAdded({ handle, variantId, at: Date.now() });
  }, []);

  const setQty = useCallback((variantId: number, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.variantId !== variantId) : prev.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const value = useMemo<CartState>(() => {
    const subtotal = lines.reduce((sum, l) => sum + (productByHandle.get(l.handle)?.price ?? 0) * l.qty, 0);
    const count = lines.reduce((n, l) => n + l.qty, 0);
    // Shopify cart permalink: hands the bag to the store's own checkout.
    const checkoutUrl = lines.length ? `${STORE_ORIGIN}/cart/${lines.map((l) => `${l.variantId}:${l.qty}`).join(",")}` : STORE_ORIGIN;
    return { lines, count, subtotal, open, setOpen, add, setQty, checkoutUrl, lastAdded };
  }, [lines, open, add, setQty, lastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
