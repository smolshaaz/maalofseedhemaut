import Image from "next/image";
import { products } from "@/data/products";

// A still, blurred slice of the wall: the reel's closing frame, used behind statements.
export function WallBackdrop({ rows = 5, cols = 8, blur = 10 }: { rows?: number; cols?: number; blur?: number }) {
  const cells = Array.from({ length: rows * cols }, (_, k) => products[(k * 5 + Math.floor(k / cols) * 3) % products.length]);
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute -inset-16 grid content-center gap-6"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, filter: `blur(${blur}px)`, transform: "scale(1.05)" }}
      >
        {cells.map((p, k) => (
          <div key={k} className="polaroid !p-[7%] !pb-[16%]">
            <div className="polaroid-plate">
              <Image src={p.images[0]} alt="" fill sizes="120px" loading="eager" className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
