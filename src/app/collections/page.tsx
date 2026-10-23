import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TopLogo } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { collections, productsIn } from "@/data/products";

export const metadata: Metadata = { title: "Collections", description: "SMFC, SMX, Core, Vinyl and Accessories." };

export default function CollectionsPage() {
  return (
    <main className="min-h-dvh">
      <TopLogo />
      <h1 className="sr-only">Collections</h1>
      <ul className="pt-20 sm:pt-24">
        {collections.map((c, idx) => {
          const prints = productsIn(c.handle).slice(0, 3);
          return (
            <li key={c.handle} className="rise" style={{ animationDelay: `${idx * 70}ms` }}>
              <Link
                href={`/collections/${c.handle}`}
                className="group relative flex items-center justify-between gap-4 overflow-hidden border-t border-ink/12 px-4 py-6 sm:px-8 sm:py-8"
              >
                {/* The collection's own colour floods in from below on hover. */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-y-100"
                  style={{ background: c.field }}
                />
                <span className="relative flex flex-col transition-colors duration-300" style={{ ["--hover-ink" as string]: c.ink }}>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/50 transition-colors duration-300 group-hover:text-[var(--hover-ink)]">
                    {String(idx + 1).padStart(2, "0")} / {c.kicker}
                  </span>
                  <span className="display text-[clamp(56px,12vw,180px)] leading-[0.85] transition-colors duration-300 group-hover:text-[var(--hover-ink)]">
                    {c.title}
                  </span>
                </span>
                <span className="fan relative hidden h-[150px] w-[300px] shrink-0 sm:block" aria-hidden>
                  {prints.map((p, i) => (
                    <span
                      key={p.handle}
                      className="polaroid absolute top-1/2 w-[120px] !p-2 !pb-5"
                      style={{
                        left: `${i * 72}px`,
                        zIndex: 3 - i,
                        ["--r" as string]: `${(i - 1) * 6}deg`,
                        ["--dx" as string]: `${(i - 1) * 34}px`,
                      }}
                    >
                      <span className="polaroid-plate block">
                        <Image src={p.images[0]} alt="" fill sizes="120px" className="object-cover" />
                      </span>
                    </span>
                  ))}
                </span>
                <span className="relative shrink-0 text-[13px] tabular-nums text-ink/50 transition-colors group-hover:text-[var(--hover-ink)] sm:hidden" style={{ ["--hover-ink" as string]: c.ink }}>
                  {productsIn(c.handle).length}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Footer />
    </main>
  );
}
