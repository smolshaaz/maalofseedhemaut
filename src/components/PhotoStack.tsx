"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// Back cards sit slightly off-axis, like a hand-held stack of prints.
const POSES = [
  "translate3d(0,0,0) rotate(0deg) scale(1)",
  "translate3d(-7%,2.5%,0) rotate(-5deg) scale(0.97)",
  "translate3d(6%,1.5%,0) rotate(4deg) scale(0.95)",
];

type Props = {
  images: string[];
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Start squared up and fan the back prints out a beat later (used when the stack flies in). */
  collapsed?: boolean;
  stackRef?: React.Ref<HTMLDivElement>;
  className?: string;
};

export function PhotoStack({ images, alt, sizes = "(max-width: 640px) 80vw, 440px", priority, collapsed, stackRef, className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const [fanned, setFanned] = useState(!collapsed);
  const [leaving, setLeaving] = useState<{ src: string; dir: 1 | -1 } | null>(null);
  const [dragX, setDragX] = useState(0);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const n = images.length;

  useEffect(() => {
    if (fanned) return;
    const t = window.setTimeout(() => setFanned(true), 380);
    return () => window.clearTimeout(t);
  }, [fanned]);

  const advance = useCallback(
    (dir: 1 | -1 = 1) => {
      if (n < 2 || leaving) return;
      setLeaving({ src: images[index % n], dir });
      const next = (index + 1) % n;
      window.setTimeout(() => {
        setIndex(next);
        setLeaving(null);
      }, 300);
    },
    [images, index, leaving, n],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    setDragX(dx);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    const { moved } = drag.current;
    drag.current = null;
    const dx = dragX;
    setDragX(0);
    if (!moved || Math.abs(dx) > 60) advance(dx < 0 ? -1 : 1);
  };

  // Up to three prints, top first; the rest wait out of sight at the back.
  const visible = Array.from({ length: Math.min(n, 3) }, (_, d) => ({ src: images[(index + d) % n], depth: d }));

  return (
    <div
      ref={stackRef}
      className={`relative aspect-[0.86] w-full select-none outline-none ${className}`}
      tabIndex={n > 1 ? 0 : undefined}
      role={n > 1 ? "group" : undefined}
      aria-roledescription={n > 1 ? "photo stack" : undefined}
      aria-label={n > 1 ? `${alt}, photos. Use arrow keys or tap to flip.` : undefined}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          advance(1);
        }
        if (e.key === "ArrowLeft") advance(-1);
      }}
    >
      {visible
        .slice()
        .reverse()
        .map(({ src, depth }) => {
          const isTop = depth === 0;
          const out = leaving?.src === src;
          let transform = fanned ? POSES[depth] : POSES[0];
          if (out) transform = `translate3d(${leaving!.dir * 118}%, -6%, 0) rotate(${leaving!.dir * 16}deg) scale(0.94)`;
          else if (isTop && dragX) transform = `translate3d(${dragX}px, ${Math.abs(dragX) * -0.04}px, 0) rotate(${dragX / 20}deg)`;
          return (
            <div
              key={src}
              className="polaroid absolute inset-0 touch-pan-y"
              style={{
                transform,
                zIndex: 10 - depth,
                opacity: out ? 0 : 1,
                transition:
                  dragX && isTop
                    ? "none"
                    : out
                      ? "transform 420ms var(--ease-out), opacity 300ms ease 80ms"
                      : `transform 800ms var(--spring-bouncy) ${depth * 50}ms, opacity 300ms ease`,
                cursor: isTop && n > 1 ? "grab" : "default",
              }}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
            >
              <div className="polaroid-plate">
                <Image src={src} alt={isTop ? alt : ""} fill sizes={sizes} priority={priority} draggable={false} className="object-cover" />
              </div>
              <div className="h-[13%]" />
            </div>
          );
        })}
      {n > 1 && (
        <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1.5" aria-hidden>
          {images.map((src, i) => (
            <span
              key={src}
              className={`h-1 rounded-full transition-all duration-500 [transition-timing-function:var(--spring-bouncy)] ${i === index ? "w-5 bg-ink" : "w-1 bg-ink/25"}`}
            />
          ))}
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        Photo {index + 1} of {n}
      </span>
    </div>
  );
}
