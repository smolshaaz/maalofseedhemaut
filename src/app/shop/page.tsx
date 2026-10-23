import type { Metadata } from "next";
import { TopLogo } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { ShopIndex } from "@/components/ShopIndex";
import { products } from "@/data/products";

export const metadata: Metadata = { title: "Index", description: "Every piece of Seedhe Maut merch on one page." };

export default function ShopPage() {
  return (
    <main className="min-h-dvh">
      <TopLogo />
      <section className="px-4 pt-24 sm:px-8 sm:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="display text-[clamp(64px,14vw,210px)] leading-[0.8]">
            <span className="line-mask">
              <span>Index</span>
            </span>
          </h1>
          <p className="max-w-[300px] pb-2 text-[14px] leading-snug text-ink/65">
            The whole wall, laid flat. {products.length} pieces across SMFC, SMX, Core, Vinyl and Accessories. Tap any print to pick it up.
          </p>
        </div>
        <ShopIndex />
      </section>
      <Footer />
    </main>
  );
}
