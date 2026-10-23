"use client";

import { useEffect, useRef } from "react";

// Palmer-style: on wide screens the page scrolls sideways while the wheel moves down.
// On phones it falls back to a plain vertical stack.
export function HorizontalScroll({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current!;
    const t = track.current!;
    const mq = window.matchMedia("(min-width: 768px)");
    let raf = 0;

    const layout = () => {
      if (!mq.matches) {
        o.style.height = "";
        t.style.transform = "";
        return;
      }
      const distance = t.scrollWidth - window.innerWidth;
      o.style.height = `${distance + window.innerHeight}px`;
      update();
    };
    const update = () => {
      if (!mq.matches) return;
      const distance = t.scrollWidth - window.innerWidth;
      const top = o.getBoundingClientRect().top;
      const x = Math.min(distance, Math.max(0, -top));
      t.style.transform = `translate3d(${-x}px,0,0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(t);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    mq.addEventListener("change", layout);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      mq.removeEventListener("change", layout);
    };
  }, []);

  return (
    <div ref={outer} className={`relative ${className}`}>
      <div className="md:sticky md:top-0 md:h-dvh md:overflow-hidden">
        <div ref={track} className="flex flex-col will-change-transform md:h-full md:w-max md:flex-row">
          {children}
        </div>
      </div>
    </div>
  );
}
