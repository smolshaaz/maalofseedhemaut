"use client";

import { CartProvider } from "@/lib/cart";
import { AddedToast, BagSheet, Dock } from "./Chrome";
import { ProductSheetProvider } from "./ProductSheet";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ProductSheetProvider>
        {children}
        <Dock />
        <BagSheet />
        <AddedToast />
      </ProductSheetProvider>
    </CartProvider>
  );
}
