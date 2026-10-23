"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { collectionByHandle, collections, formatPrice, isSoldOut, productByHandle, products, productsIn } from "@/data/products";
import { ALL_PIECES, LAYOUT_SETS, type Layout, type LayoutSet, type Placed, type WallFilter, type WallVideo } from "@/lib/wallLayout";
import { Mark } from "./Chrome";
import { ArrowIcon, DragIcon, MinusIcon, PlusIcon } from "./Icons";
import { useProductSheet } from "./ProductSheet";
import { WallBackdrop } from "./WallBackdrop";

// The 540p cut of the SMFC film from the official store; tiles never need more.
const FILM_SRC = "https://cdn.shopify.com/videos/c/o/v/13caee1a43c842f193807058ff77023b.mp4";
const MAX_ZOOM = 2.2; // relative to 100%
type Cam = { x: number; y: number; s: number };

// "100%" is the default view for the device: prints at full size on a laptop, scaled to suit a phone.
const baseScale = (vw: number) => (vw < 640 ? 0.56 : vw < 1024 ? 0.78 : 1);

// Room the floating controls take, so the wall is framed between them.
const chrome = (vw: number) => ({ top: vw < 640 ? 112 : 76, bottom: vw < 640 ? 92 : 96 });

function fitCam(layout: Layout, vw: number, vh: number, cap: number): Cam {
  const { minX, minY, maxX, maxY } = layout.bounds;
  const ui = chrome(vw);
  const padX = vw < 640 ? 16 : 56;
  const s = Math.min(cap, (vw - padX * 2) / (maxX - minX), (vh - ui.top - ui.bottom) / (maxY - minY));
  return { s, x: vw / 2 - ((minX + maxX) / 2) * s, y: ui.top + (vh - ui.top - ui.bottom) / 2 - ((minY + maxY) / 2) * s };
}

function defaultCam(layout: Layout, vw: number, vh: number): Cam {
  const { minX, minY, maxX, maxY } = layout.bounds;
  const s = baseScale(vw);
  const ui = chrome(vw);
  return { s, x: vw / 2 - ((minX + maxX) / 2) * s, y: ui.top + (vh - ui.top - ui.bottom) / 2 - ((minY + maxY) / 2) * s };
}

export function Wall() {
  const router = useRouter();
  const { openProduct } = useProductSheet();
  const viewport = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const cam = useRef<Cam>({ x: 0, y: 0, s: 1 });
  const target = useRef<Cam | null>(null);
  const saved = useRef<Cam | null>(null);
  const vel = useRef({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ moved: boolean; sx: number; sy: number; pinchDist?: number; pinchS?: number; t: number }>({ moved: false, sx: 0, sy: 0, t: 0 });
  const raf = useRef(0);
  const [filter, setFilter] = useState<WallFilter>("all");
  const [portrait, setPortrait] = useState(false);
  // Pieces only glide between positions once the first, device-specific hang is in place.
  const [settled, setSettled] = useState(false);
  const filterRef = useRef(filter);
  filterRef.current = filter;
  const LAYOUTS: LayoutSet = LAYOUT_SETS[portrait ? "portrait" : "landscape"];
  const setsRef = useRef<LayoutSet>(LAYOUT_SETS.landscape);
  setsRef.current = LAYOUTS;
  const layoutRef = useRef<Layout>(LAYOUT_SETS.landscape.all);
  const [intro, setIntro] = useState<"on" | "leaving" | "off">("on");
  const [entered, setEntered] = useState(false);
  const [zoom, setZoom] = useState({ pct: 100, overview: false });
  const layout = LAYOUTS[filter];
  layoutRef.current = layout;

  const size = () => ({ w: viewport.current!.clientWidth, h: viewport.current!.clientHeight });

  // How far the wall may be dragged: its edges can come in by about a fifth of the
  // screen past the controls, never further. Smaller than the screen, it stays centred.
  const limits = useCallback((s: number) => {
    const { w, h } = size();
    const { minX, minY, maxX, maxY } = layoutRef.current.bounds;
    const ui = chrome(w);
    const mx = w * 0.2;
    const top = ui.top + h * 0.1;
    const bottom = ui.bottom + h * 0.1;
    let x0 = w - mx - maxX * s;
    let x1 = mx - minX * s;
    let y0 = h - bottom - maxY * s;
    let y1 = top - minY * s;
    if (x0 > x1) x0 = x1 = w / 2 - ((minX + maxX) / 2) * s;
    if (y0 > y1) y0 = y1 = ui.top + (h - ui.top - ui.bottom) / 2 - ((minY + maxY) / 2) * s;
    return { x0, x1, y0, y1 };
  }, []);

  const report = useCallback((s: number) => {
    const { w, h } = size();
    const fit = fitCam(layoutRef.current, w, h, baseScale(w)).s;
    setZoom({ pct: Math.round((s / baseScale(w)) * 100), overview: Math.abs(s - fit) < 0.004 && fit < baseScale(w) * 0.98 });
  }, []);

  const apply = useCallback(() => {
    const { x, y, s } = cam.current;
    if (world.current) world.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
  }, []);

  // One loop for inertia, eased camera moves, and the pull back inside the limits.
  const tick = useCallback(() => {
    const c = cam.current;
    let active = false;
    if (target.current) {
      const t = target.current;
      c.x += (t.x - c.x) * 0.13;
      c.y += (t.y - c.y) * 0.13;
      c.s += (t.s - c.s) * 0.13;
      if (Math.abs(t.s - c.s) < 0.0004 && Math.abs(t.x - c.x) < 0.3 && Math.abs(t.y - c.y) < 0.3) {
        Object.assign(c, t);
        target.current = null;
      } else active = true;
    } else if (pointers.current.size === 0) {
      const v = vel.current;
      if (Math.abs(v.x) > 0.05 || Math.abs(v.y) > 0.05) {
        c.x += v.x;
        c.y += v.y;
        v.x *= 0.93;
        v.y *= 0.93;
        active = true;
      }
      const l = limits(c.s);
      const cx = Math.min(l.x1, Math.max(l.x0, c.x));
      const cy = Math.min(l.y1, Math.max(l.y0, c.y));
      if (Math.abs(cx - c.x) > 0.3 || Math.abs(cy - c.y) > 0.3) {
        if (cx !== c.x) v.x *= 0.4;
        if (cy !== c.y) v.y *= 0.4;
        c.x += (cx - c.x) * 0.2;
        c.y += (cy - c.y) * 0.2;
        active = true;
      } else {
        c.x = cx;
        c.y = cy;
      }
    }
    apply();
    raf.current = active ? requestAnimationFrame(tick) : 0;
  }, [apply, limits]);

  const kick = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, [tick]);

  const flyTo = useCallback(
    (next: Cam) => {
      vel.current = { x: 0, y: 0 };
      target.current = next;
      report(next.s);
      kick();
    },
    [kick, report],
  );

  const zoomAround = useCallback(
    (factor: number, cx: number, cy: number, animate = false) => {
      const { w, h } = size();
      const base = target.current ?? cam.current;
      const min = fitCam(layoutRef.current, w, h, baseScale(w)).s;
      const s = Math.min(baseScale(w) * MAX_ZOOM, Math.max(Math.min(min, baseScale(w)), base.s * factor));
      const k = s / base.s;
      const next = { x: cx - (cx - base.x) * k, y: cy - (cy - base.y) * k, s };
      if (animate) target.current = next;
      else Object.assign(cam.current, next);
      report(s);
      apply();
      kick();
    },
    [apply, kick, report],
  );

  // The % button: see the whole wall at once, and back again to where you were.
  const toggleOverview = () => {
    const { w, h } = size();
    if (zoom.overview) {
      flyTo(saved.current ?? defaultCam(layoutRef.current, w, h));
      saved.current = null;
    } else {
      saved.current = { ...(target.current ?? cam.current) };
      flyTo(fitCam(layoutRef.current, w, h, baseScale(w)));
    }
  };

  // First paint: 100%, centred on the middle of the wall (where the film hangs).
  useLayoutEffect(() => {
    const { w, h } = size();
    const sets = LAYOUT_SETS[w < 640 ? "portrait" : "landscape"];
    setsRef.current = sets;
    setPortrait(w < 640);
    layoutRef.current = sets.all;
    const initial = new URLSearchParams(window.location.search).get("c");
    let seen = false;
    try {
      seen = sessionStorage.getItem("maal.intro") === "1";
    } catch {}
    if (initial && initial in sets && initial !== "all") {
      setFilter(initial as WallFilter);
      layoutRef.current = sets[initial as WallFilter];
    }
    const home = defaultCam(layoutRef.current, w, h);
    // During the intro the wall waits a touch closer, then settles back to 100%.
    cam.current = seen ? home : { ...home, s: home.s * 1.12, x: w / 2 - (w / 2 - home.x) * 1.12, y: h / 2 - (h / 2 - home.y) * 1.12 };
    target.current = seen ? null : home;
    report(home.s);
    apply();
    if (seen) {
      setIntro("off");
      setEntered(true);
    }
    kick();
    const onResize = () => {
      // Crossing the phone breakpoint re-hangs the wall in the other shape.
      const p = size().w < 640;
      if (p !== (setsRef.current === LAYOUT_SETS.portrait)) {
        setsRef.current = LAYOUT_SETS[p ? "portrait" : "landscape"];
        setPortrait(p);
        layoutRef.current = setsRef.current[filterRef.current];
        const { w: nw, h: nh } = size();
        flyTo(defaultCam(layoutRef.current, nw, nh));
      }
      report(cam.current.s);
      kick();
    };
    window.addEventListener("resize", onResize);
    const ready = requestAnimationFrame(() => setSettled(true));
    return () => {
      cancelAnimationFrame(ready);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [apply, kick, report, flyTo]);

  // "MAAL IS BACK": the reel's last frame opens the site, then the prints get pinned up.
  const dismissIntro = useCallback(() => {
    try {
      sessionStorage.setItem("maal.intro", "1");
    } catch {}
    setIntro((i) => (i === "on" ? "leaving" : i));
    setEntered(true);
    kick();
    window.setTimeout(() => setIntro("off"), 800);
  }, [kick]);

  useEffect(() => {
    if (intro !== "on") return;
    const t = window.setTimeout(dismissIntro, 2400);
    return () => window.clearTimeout(t);
  }, [intro, dismissIntro]);

  const changeFilter = (f: WallFilter) => {
    if (f === filter) return;
    setFilter(f);
    layoutRef.current = setsRef.current[f];
    saved.current = null;
    window.history.replaceState(window.history.state, "", f === "all" ? "/" : `/?c=${f}`);
    const { w, h } = size();
    // A single collection usually fits on screen at 100%; if not, show all of it.
    const home = defaultCam(setsRef.current[f], w, h);
    const fit = fitCam(setsRef.current[f], w, h, baseScale(w));
    flyTo(f === "all" ? home : fit.s >= home.s * 0.98 ? home : fit);
  };

  // Trackpad: two-finger scroll pans, pinch (ctrl+wheel) zooms around the cursor.
  useEffect(() => {
    const vp = viewport.current!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.current = null;
      vel.current = { x: 0, y: 0 };
      if (e.ctrlKey || e.metaKey) {
        const r = vp.getBoundingClientRect();
        zoomAround(Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top);
      } else {
        const l = limits(cam.current.s);
        const c = cam.current;
        const resist = (v: number, a: number, b: number) => (v < a || v > b ? 0.25 : 1);
        c.x -= e.deltaX * resist(c.x, l.x0, l.x1);
        c.y -= e.deltaY * resist(c.y, l.y0, l.y1);
        apply();
        kick();
      }
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [apply, kick, limits, zoomAround]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    target.current = null;
    vel.current = { x: 0, y: 0 };
    if (pointers.current.size === 1) gesture.current = { moved: false, sx: e.clientX, sy: e.clientY, t: performance.now() };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      gesture.current.pinchS = cam.current.s;
      gesture.current.moved = true;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (tag.current) tag.current.style.transform = `translate3d(${e.clientX + 18}px, ${e.clientY + 18}px, 0)`;
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const now = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, now);
    const g = gesture.current;
    if (pointers.current.size === 2 && g.pinchDist && g.pinchS) {
      const [a, b] = [...pointers.current.values()];
      const r = viewport.current!.getBoundingClientRect();
      const s = g.pinchS * (Math.hypot(a.x - b.x, a.y - b.y) / g.pinchDist);
      zoomAround(s / cam.current.s, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      return;
    }
    if (!g.moved && Math.hypot(e.clientX - g.sx, e.clientY - g.sy) > 6) {
      g.moved = true;
      // Capture only once it is a drag, so a plain tap still clicks the piece under it.
      viewport.current!.setPointerCapture(e.pointerId);
      tag.current?.removeAttribute("data-on");
    }
    // Past the limits the drag gets heavy, like pulling against a rubber band.
    const l = limits(cam.current.s);
    const c = cam.current;
    const dx = (now.x - prev.x) * (c.x < l.x0 || c.x > l.x1 ? 0.25 : 1);
    const dy = (now.y - prev.y) * (c.y < l.y0 || c.y > l.y1 ? 0.25 : 1);
    c.x += dx;
    c.y += dy;
    const dt = Math.max(1, performance.now() - g.t);
    g.t = performance.now();
    vel.current = { x: (dx / dt) * 16, y: (dy / dt) * 16 };
    apply();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      if (performance.now() - gesture.current.t > 80) vel.current = { x: 0, y: 0 };
      kick();
    }
  };

  const activate = useCallback(
    (p: Placed, el: HTMLElement) => {
      if (gesture.current.moved) return;
      if (p.kind === "product") openProduct(p.handle!, el);
      else router.push("/collections/smfc");
    },
    [openProduct, router],
  );

  const showTag = useCallback((p: Placed) => {
    const el = tag.current;
    if (!el || pointers.current.size) return;
    if (p.kind === "product") {
      const prod = productByHandle.get(p.handle!)!;
      el.firstElementChild!.textContent = prod.title;
      el.lastElementChild!.textContent = isSoldOut(prod) ? "Sold out" : formatPrice(prod.price);
    } else {
      el.firstElementChild!.textContent = "The SMFC drop";
      el.lastElementChild!.textContent = "See the kit";
    }
    el.setAttribute("data-on", "");
  }, []);
  const hideTag = useCallback(() => tag.current?.removeAttribute("data-on"), []);

  const zoomBy = (f: number) => {
    const { w, h } = size();
    saved.current = null;
    zoomAround(f, w / 2, h / 2, true);
  };

  // Pieces pin in from the middle outward.
  const delayOf = (p: Placed) => {
    const { minX, minY, maxX, maxY } = LAYOUTS.all.bounds;
    const d = Math.hypot(p.x + p.w / 2 - (minX + maxX) / 2, p.y + p.h / 2 - (minY + maxY) / 2);
    return Math.round(100 + d * 0.28);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-wall">
      <h1 className="sr-only">MAAL, the Seedhe Maut merch wall</h1>
      <div
        ref={viewport}
        className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-hidden
      >
        <div ref={world} className="absolute left-0 top-0 origin-top-left will-change-transform" data-paused={entered ? undefined : ""}>
          {ALL_PIECES.map((base, i) => {
            const p = layout.pieces.get(base.id);
            const shown = !!p;
            const at = p ?? LAYOUTS.all.pieces.get(base.id)!;
            return (
              <div
                key={base.id}
                className="absolute left-0 top-0"
                style={{
                  width: at.w,
                  height: at.h,
                  transform: `translate3d(${at.x}px, ${at.y}px, 0) scale(${shown ? 1 : 0.55})`,
                  opacity: shown ? 1 : 0,
                  pointerEvents: shown ? undefined : "none",
                  transition: settled ? `transform 1100ms var(--spring-soft) ${(i % 12) * 22}ms, opacity 420ms ease ${shown ? (i % 12) * 22 + 120 : 0}ms` : "none",
                }}
              >
                <div className="pin-in size-full" style={{ animationDelay: `${delayOf(LAYOUTS.all.pieces.get(base.id)!)}ms` }}>
                  <WallPiece piece={at} hidden={!shown} onActivate={activate} onEnter={showTag} onLeave={hideTag} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div ref={tag} className="cursor-tag glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold" aria-hidden>
        <span />
        <span className="font-normal text-ink/55" />
      </div>

      {/* Keyboard and screen-reader route through the same catalogue. */}
      <nav aria-label="All products" className="sr-only">
        <ul>
          {products.map((p) => (
            <li key={p.handle}>
              <button type="button" onClick={() => openProduct(p.handle)}>
                {p.title}, {formatPrice(p.price)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Filter: re-hangs the wall with only that collection. */}
      <div className="pointer-events-none fixed inset-x-0 top-[64px] z-30 flex justify-center px-4 sm:top-5">
        <div role="radiogroup" aria-label="Show on the wall" className="glass hide-scrollbar pointer-events-auto relative flex max-w-full gap-0.5 overflow-x-auto rounded-full p-1">
          {(["all", ...collections.map((c) => c.handle)] as const).map((h) => {
            const on = filter === h;
            const label = h === "all" ? "All" : collectionByHandle.get(h)!.title;
            const count = h === "all" ? products.length : productsIn(h).length;
            return (
              <button
                key={h}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => changeFilter(h)}
                className={`relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-[background-color,color,transform] duration-300 active:scale-95 ${
                  on ? "bg-ink text-paper" : "hover:bg-ink/[0.07]"
                }`}
              >
                {label}
                <span className={`text-[10.5px] tabular-nums ${on ? "text-paper/55" : "text-ink/40"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Link
        href="/collections/smfc"
        className="glass fixed right-4 top-4 z-30 hidden items-center gap-2 rounded-full py-1.5 pl-2.5 pr-3 text-[12.5px] font-semibold transition-transform duration-500 [transition-timing-function:var(--spring-bouncy)] hover:-translate-y-0.5 sm:right-6 sm:top-5 xl:flex"
      >
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-red opacity-60" />
          <span className="relative size-2 rounded-full bg-red" />
        </span>
        SMFC drop is live
        <ArrowIcon className="size-3.5" />
      </Link>

      {/* Phones: top right, clear of the menu dock. Larger screens: bottom right, Palmer-style. */}
      <div className="fixed right-4 top-4 z-30 flex items-center gap-3 sm:bottom-6 sm:right-6 sm:top-auto">
        <span className="hidden items-center gap-1.5 text-[12px] font-medium text-ink/55 lg:flex">
          <DragIcon className="size-3.5" /> Drag to explore
        </span>
        <div className="glass flex items-center gap-0.5 rounded-full p-1">
          <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.3)} className="hidden size-8 place-items-center rounded-full transition-colors hover:bg-ink/[0.07] md:grid">
            <MinusIcon className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleOverview}
            aria-label={zoom.overview ? "Back to 100%" : "See the whole wall"}
            title={zoom.overview ? "Back to 100%" : "See the whole wall"}
            className="flex h-8 min-w-12 items-center justify-center gap-1 rounded-full px-2 text-[11.5px] font-semibold tabular-nums transition-colors hover:bg-ink/[0.07]"
          >
            <OverviewIcon open={zoom.overview} />
            {zoom.pct}%
          </button>
          <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1.3)} className="hidden size-8 place-items-center rounded-full transition-colors hover:bg-ink/[0.07] md:grid">
            <PlusIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {intro !== "off" && (
        <button
          type="button"
          onClick={dismissIntro}
          aria-label="Enter the wall"
          className="fixed inset-0 z-[45] overflow-hidden bg-ink text-paper transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-in-out)]"
          style={{ opacity: intro === "leaving" ? 0 : 1, transform: intro === "leaving" ? "scale(1.06)" : "none" }}
        >
          <WallBackdrop blur={12} />
          <span className="absolute inset-0 bg-black/50" />
          <span className="relative flex h-full flex-col items-center justify-center gap-4">
            <span className="pin-in" style={{ animationDelay: "100ms" }}>
              <Mark invert className="size-14" />
            </span>
            <span className="line-mask display text-[clamp(44px,9vw,128px)] text-white">
              <span style={{ ["--line-delay" as string]: "220ms" }}>Maal is back</span>
            </span>
            <span
              className="rise rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] backdrop-blur-md"
              style={{ animationDelay: "520ms" }}
            >
              maal.seedhemaut.com
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

// Four corners pointing out (see everything) or in (back to 100%).
function OverviewIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <g style={{ transform: open ? "rotate(180deg)" : "none", transformOrigin: "center", transition: "transform 500ms var(--spring-bouncy)" }}>
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
      </g>
    </svg>
  );
}

const WallPiece = memo(function WallPiece({
  piece,
  hidden,
  onActivate,
  onEnter,
  onLeave,
}: {
  piece: Placed;
  hidden: boolean;
  onActivate: (p: Placed, el: HTMLElement) => void;
  onEnter: (p: Placed) => void;
  onLeave: () => void;
}) {
  const common = {
    type: "button" as const,
    tabIndex: -1,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => onActivate(piece, e.currentTarget),
    onPointerEnter: () => onEnter(piece),
    onPointerLeave: onLeave,
    style: { ["--rot" as string]: `${piece.rot}deg` },
  };

  if (piece.kind === "video") {
    const v = piece.video!;
    return (
      <button {...common} className="wall-card polaroid flex size-full flex-col !p-[5%] !pb-0 outline-none">
        <span className="relative block w-full flex-1 overflow-hidden bg-ink">
          <WallClip video={v} paused={hidden} />
          <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-red" />
            {v.label}
          </span>
        </span>
        <span className="block h-[9%] min-h-5 shrink-0" />
      </button>
    );
  }

  const p = productByHandle.get(piece.handle!)!;
  return (
    <button {...common} data-card={p.handle} className="wall-card polaroid block size-full !p-[7%] !pb-0 outline-none">
      <span className="polaroid-plate block">
        <Image src={p.images[0]} alt="" fill sizes={`${Math.round(piece.w * 1.6)}px`} draggable={false} className="object-cover" />
        {isSoldOut(p) ? (
          <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-paper">Sold out</span>
        ) : p.compareAt ? (
          <span className="absolute left-2 top-2 rounded-full bg-red px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Half off</span>
        ) : null}
      </span>
    </button>
  );
});

// Loops one cut of the film, frame-accurately, and only plays while it is on screen.
function WallClip({ video, paused }: { video: WallVideo; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let visible = false;
    let frame = 0;
    const full = video.end - video.start > 20;
    const guard = () => {
      if (!full && el.currentTime >= video.end - 0.04) el.currentTime = video.start;
      frame = requestAnimationFrame(guard);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (visible && !paused && !document.hidden) {
        el.playbackRate = video.rate;
        if (el.currentTime < video.start || el.currentTime > video.end) el.currentTime = video.start;
        el.play().catch(() => {});
        frame = requestAnimationFrame(guard);
      } else el.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    el.addEventListener("loadedmetadata", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.removeEventListener("loadedmetadata", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [video, paused]);

  return (
    <video
      ref={ref}
      src={`${FILM_SRC}#t=${video.start}`}
      muted
      playsInline
      loop={video.end - video.start > 20}
      preload="metadata"
      className="absolute inset-0 size-full object-cover"
      style={{ objectPosition: video.position }}
    />
  );
}
