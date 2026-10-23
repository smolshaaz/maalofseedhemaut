import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopLogo } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { HorizontalScroll } from "@/components/HorizontalScroll";
import { ArrowIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { collectionByHandle, collections, HERO_VIDEO, productsIn, type CollectionHandle } from "@/data/products";

type Params = { params: Promise<{ handle: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = collectionByHandle.get((await params).handle as CollectionHandle);
  return c ? { title: c.title, description: c.intro } : {};
}

export default async function CollectionPage({ params }: Params) {
  const { handle } = await params;
  const c = collectionByHandle.get(handle as CollectionHandle);
  if (!c) notFound();
  const items = productsIn(c.handle);
  const lead = items[0];
  const next = collections[(collections.indexOf(c) + 1) % collections.length];
  const light = c.ink !== "#141414" && c.ink !== "#161616";

  return (
    <main style={{ background: c.field, color: c.ink }} className="min-h-dvh">
      <TopLogo tone={light ? "paper" : "ink"} />

      <HorizontalScroll>
        {/* 1. The picture. SMFC gets the drop film; the rest a lead print, blown up. */}
        <section className="relative h-[78dvh] w-full shrink-0 overflow-hidden md:h-full md:w-[42vw]">
          {c.handle === "smfc" ? (
            <video src={HERO_VIDEO} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" aria-label="SMFC jersey film" />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-black/10 p-10">
              <div className="polaroid pin-in w-[min(78%,440px)]" style={{ animationDelay: "200ms" }}>
                <div className="polaroid-plate">
                  <Image src={lead.images[0]} alt={lead.title} fill priority sizes="(max-width: 768px) 80vw, 34vw" className="object-cover" />
                </div>
                <div className="h-10" />
              </div>
            </div>
          )}
        </section>

        {/* 2. Name, line, specifications. */}
        <section className="flex w-full shrink-0 flex-col justify-between gap-10 px-5 py-14 md:h-full md:w-[46vw] md:px-12 md:py-20">
          <div>
            <p className="rise text-[13px] font-semibold uppercase tracking-[0.14em] opacity-70">{c.kicker}</p>
            <h1 className="display mt-3 text-[clamp(72px,11vw,190px)] leading-[0.82]">
              <span className="line-mask">
                <span style={{ ["--line-delay" as string]: "120ms" }}>{c.title}</span>
              </span>
            </h1>
            <p className="rise mt-6 max-w-[30ch] text-[clamp(20px,1.9vw,28px)] leading-[1.15]" style={{ animationDelay: "320ms" }}>
              {c.intro}
            </p>
          </div>
          <div className="max-w-[440px]">
            <h2 className="text-[20px] font-medium">Specifications</h2>
            <dl className="mt-3 text-[13px]">
              {c.specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 border-b py-2" style={{ borderColor: "currentColor", borderBottomColor: "color-mix(in srgb, currentColor 22%, transparent)" }}>
                  <dt className="opacity-60">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[14px] leading-relaxed opacity-80">{c.body}</p>
          </div>
        </section>

        {/* 3. The pieces, pinned up at slightly different heights. */}
        <section className="grid w-full shrink-0 grid-cols-2 gap-x-4 gap-y-10 px-5 pb-16 md:flex md:h-full md:w-max md:items-center md:gap-10 md:px-10 md:pb-0">
          {items.map((p, i) => (
            <div key={p.handle} className="md:w-[min(24vw,300px)]" style={{ transform: `translateY(${[0, 36, -24, 20, -10][i % 5]}px)` }}>
              <Reveal delay={(i % 4) * 70} rot={[-6, 5, -4, 7, -5][i % 5]}>
                <ProductCard product={p} tilt={[-1.2, 0.8, -0.4, 1.4, -0.9][i % 5]} tone={light ? "paper" : "ink"} sizes="(max-width: 768px) 45vw, 300px" />
              </Reveal>
            </div>
          ))}
        </section>

        {/* 4. Onward. */}
        <section className="flex w-full shrink-0 items-center px-5 py-20 md:h-full md:w-[52vw] md:px-12">
          <Link href={`/collections/${next.handle}`} className="group block">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] opacity-60">Next collection</span>
            <span className="display mt-2 flex items-center gap-4 text-[clamp(56px,8vw,140px)] leading-[0.85]">
              {next.title}
              <ArrowIcon className="size-[0.5em] transition-transform duration-500 group-hover:translate-x-3" />
            </span>
          </Link>
        </section>
      </HorizontalScroll>

      <Footer />
    </main>
  );
}
