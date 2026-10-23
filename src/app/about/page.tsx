import type { Metadata } from "next";
import Link from "next/link";
import { Mark, TopLogo } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/Icons";
import { WallBackdrop } from "@/components/WallBackdrop";
import { collections, HERO_VIDEO, products } from "@/data/products";

export const metadata: Metadata = { title: "About", description: "Maal is the official merch of Seedhe Maut, made in India." };

const FIGURES: [string, string][] = [
  [String(products.length), "pieces on the wall"],
  [String(collections.length), "collections"],
  ["2", "albums on wax"],
  ["10", "years of Seedhe Maut"],
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh">
      {/* The reel's last frame, as the first thing you see. */}
      <section className="relative grid h-dvh place-items-center overflow-hidden bg-ink">
        <WallBackdrop />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex flex-col items-center gap-4 px-4 text-center text-white">
          <span className="rise">
            <Mark invert className="size-14" />
          </span>
          <h1 className="display rise text-[clamp(52px,10vw,150px)]" style={{ animationDelay: "120ms" }}>
            Maal is back
          </h1>
          <span className="rise rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] backdrop-blur-md" style={{ animationDelay: "240ms" }}>
            maal.seedhemaut.com
          </span>
        </div>
      </section>
      <TopLogo tone="paper" blend />

      <section className="px-4 py-24 sm:px-8 sm:py-32">
        <p className="display max-w-[16ch] text-[clamp(40px,6.4vw,104px)] leading-[0.9]">
          Calm and Encore ABJ. Delhi. A decade of it, on paper, cotton and wax.
        </p>
        <div className="mt-16 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
          <div className="polaroid mx-auto w-full max-w-[460px] -rotate-1">
            <div className="polaroid-plate !aspect-[4/5]">
              <video src={HERO_VIDEO} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" aria-label="The SMFC jersey on film" />
            </div>
            <div className="h-12" />
          </div>
          <div className="max-w-[52ch] space-y-5 text-[17px] leading-relaxed text-ink/80">
            <p>
              Maal is the official merch of Seedhe Maut. Every piece starts from something already in the music: the Killing It stick-men, the
              Devanagari logotype, the dragons on the SMFC crest, the tour dates on the back of a tee.
            </p>
            <p>
              The Into Battle print is illustrated by Kunal Anand with lettering by Ishan Nakate. The gamosa is embroidered, and every rupee it
              makes goes to charity. Bayaan and Nayaab are pressed in India, two of them signed.
            </p>
            <p>Tees run from 200 to 260 GSM, all cotton, all made in India. Drops are limited. When a print is gone from the wall, it is gone.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 px-4 sm:px-8">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {FIGURES.map(([n, label], i) => (
            <div key={label} className={`py-10 ${i % 2 ? "pl-5" : ""} ${i ? "md:border-l md:border-ink/10 md:pl-6" : ""}`}>
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="display block text-[clamp(56px,7vw,112px)] leading-none">{n}</span>
                <span className="mt-2 block text-[13px] text-ink/60">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-4 py-24 sm:px-8">
        <Link href="/" className="group inline-flex items-center gap-4">
          <span className="display text-[clamp(48px,8vw,128px)] leading-[0.85]">Back to the wall</span>
          <ArrowIcon className="size-10 transition-transform duration-500 group-hover:translate-x-3 sm:size-16" />
        </Link>
      </section>
      <Footer />
    </main>
  );
}
