"use client";

import { useLayoutEffect, useRef } from "react";

// Arrives when scrolled (or side-scrolled) into view. Renders visible without script.
export function Reveal({
  children,
  delay = 0,
  rot = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  rot?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current!;
    el.classList.add("reveal");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-in", "");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      style={{ ["--reveal-delay" as string]: `${delay}ms`, ["--reveal-rot" as string]: `${rot}deg` }}
    >
      {children}
    </Tag>
  );
}
