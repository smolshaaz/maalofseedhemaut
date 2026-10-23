import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { TopLogo } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/Icons";
import { PhotoStack } from "@/components/PhotoStack";
import { ProductCard } from "@/components/ProductCard";
import { collectionByHandle, productByHandle, products, productsIn, STORE_ORIGIN } from "@/data/products";

type Params = { params: Promise<{ handle: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = productByHandle.get((await params).handle);
  return p ? { title: p.title, description: p.short, openGraph: { images: [p.images[0]] } } : {};
}

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const p = productByHandle.get(handle);
  if (!p) notFound();
  const home = collectionByHandle.get(p.collections[0])!;
  const more = productsIn(home.handle).filter((x) => x.handle !== p.handle).slice(0, 4);

  return (
    <main className="min-h-dvh">
      <TopLogo />
      <div className="grid md:grid-cols-2">
        {/* Left: the stack of prints, held still while the details scroll. */}
        <section className="relative border-ink/10 md:border-r">
          <div className="flex min-h-[86dvh] items-center justify-center px-10 pb-16 pt-24 md:sticky md:top-0 md:h-dvh md:min-h-0 md:py-0">
            <div className="pin-in w-[min(78vw,440px)]" style={{ animationDelay: "120ms" }}>
              <PhotoStack images={p.images} alt={p.title} priority sizes="(max-width: 768px) 78vw, 440px" />
            </div>
          </div>
        </section>

        {/* Right: name, buy, story, specifications. */}
        <section className="flex flex-col px-5 pb-10 pt-6 sm:px-10 md:pt-28">
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold">
            {p.collections.map((h) => (
              <Link key={h} href={`/collections/${h}`} className="rounded-full bg-ink/[0.06] px-2.5 py-1 hover:bg-ink/[0.12]">
                {collectionByHandle.get(h)!.title}
              </Link>
            ))}
            {p.limited && <span className="rounded-full bg-red px-2.5 py-1 text-white">Limited</span>}
          </div>
          <h1 className="display mt-5 text-[clamp(40px,5.4vw,84px)] leading-[0.88]">
            <span className="line-mask">
              <span style={{ ["--line-delay" as string]: "100ms" }}>{p.title}</span>
            </span>
          </h1>
          <p className="mt-5 max-w-[42ch] text-[18px] leading-snug text-ink/75">{p.short}</p>

          <div className="mt-8 max-w-[440px]">
            <BuyBox product={p} />
          </div>

          <p className="mt-10 max-w-[60ch] text-[15px] leading-relaxed text-ink/80">{p.description}</p>

          <div className="mt-10 max-w-[440px]">
            <h2 className="text-[20px] font-medium">Specifications</h2>
            <dl className="mt-3 text-[13px]">
              {[
                ["Type", p.type],
                ["Code", p.code ?? "None"],
                ["Collection", home.title],
                ["Made in", "India"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 border-b border-ink/12 py-2">
                  <dt className="text-ink/55">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium">
              {p.sizeChart && (
                <a href={p.sizeChart} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline-offset-4 hover:underline">
                  Size chart <ArrowIcon className="size-3.5" />
                </a>
              )}
              <a href={`${STORE_ORIGIN}/pages/refund-and-returns-policy`} rel="noopener" className="flex items-center gap-1 underline-offset-4 hover:underline">
                Returns <ArrowIcon className="size-3.5" />
              </a>
            </div>
            <p className="mt-4 text-[12px] leading-snug text-ink/55">
              No change-of-mind returns, exchanges or refunds. Exceptions for wrong, damaged or defective items are covered in the Return Policy.
            </p>
          </div>
        </section>
      </div>

      {more.length > 0 && (
        <section className="border-t border-ink/10 px-4 pt-16 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display text-[clamp(36px,5vw,72px)]">More {home.title}</h2>
            <Link href={`/collections/${home.handle}`} className="mb-2 flex shrink-0 items-center gap-1.5 text-[13px] font-semibold">
              View all <ArrowIcon className="size-3.5" />
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {more.map((m, i) => (
              <li key={m.handle}>
                <ProductCard product={m} tilt={[-0.8, 0.6, -0.3, 0.9][i]} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <Footer />
    </main>
  );
}
