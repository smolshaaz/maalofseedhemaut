import { collections, products, type CollectionHandle, type Product } from "@/data/products";

// The wall is hung like a salon wall on a rectangular board: every product exactly once,
// big "anchor" prints spread evenly, small pieces filling around them, and no two
// look-alike pieces (two black tees, two records) hung side by side. It is packed onto
// a loose grid so the edges come out straight and there are no empty corners to pan into.
// Fully deterministic: the same wall for everyone, and server and client agree.

export type PieceKind = "product" | "video";
export type Piece = { id: string; kind: PieceKind; w: number; h: number; cols: number; rows: number; handle?: string; video?: WallVideo; look: string };
export type Placed = Piece & { x: number; y: number; rot: number; order: number };
export type Layout = { pieces: Map<string, Placed>; bounds: { minX: number; minY: number; maxX: number; maxY: number } };
export type WallFilter = CollectionHandle | "all";

// Loops cut from the SMFC drop film on the official store, between scene cuts so they never flash.
export type WallVideo = { id: string; start: number; end: number; rate: number; landscape: boolean; position: string; label: string };
export const WALL_VIDEOS: WallVideo[] = [
  { id: "film", start: 0, end: 22.1, rate: 1, landscape: true, position: "50% 50%", label: "SMFC x Jameson film" },
  { id: "clip-calm", start: 13.35, end: 16.3, rate: 0.85, landscape: false, position: "52% 40%", label: "SMFC jersey" },
  { id: "clip-encore", start: 7.75, end: 9.1, rate: 0.6, landscape: false, position: "58% 40%", label: "SMFC jersey" },
];

const UX = 60; // grid unit, horizontal
const UY = 66; // grid unit, vertical (polaroids are ~1.1x taller than wide)
const GAP = 30;

const SMALL_TYPES = new Set(["Metal Pin", "Snood", "Mug", "Sipper", "Bandana", "Football"]);
const LARGE = new Set(["jersey-top-calm-smfcj01", "iconic-gaming-pad-smgp001", "into-battle-2025-a2-art-print-smpr001", "sm-collectable-1-smcl001"]);
const WHITE = new Set(["smx-pattern-tshirt-smts005", "smx-pattern-polo-shirt-smts006"]);

function spanOf(p: Product) {
  if (p.featured || LARGE.has(p.handle) || (p.type === "Vinyl" && p.limited)) return 5;
  if (SMALL_TYPES.has(p.type)) return 3;
  return 4;
}

// What a piece looks like at a glance, so look-alikes are kept apart.
function lookOf(p: Product) {
  if (p.collections.includes("smfc")) return p.type === "Jersey" || p.type === "Shorts" ? "smfc-kit" : "smfc-gear";
  if (p.type === "Vinyl") return "vinyl";
  if (p.type === "Metal Pin" || p.type === "Snood") return "small-black";
  // Both are big red illustrations of Calm, Encore and the dragon.
  if (p.type === "Art Print" || p.type === "Gaming Pad") return "red-illustration";
  if (["T-Shirt", "Crop Top", "Tank", "Polo"].includes(p.type)) return WHITE.has(p.handle) ? "white-tee" : "black-tee";
  return `thing-${p.type}`;
}

const piece = (id: string, kind: PieceKind, cols: number, rows: number, extra: Partial<Piece>): Piece => ({
  id,
  kind,
  cols,
  rows,
  w: cols * UX - GAP,
  h: rows * UY - GAP,
  look: "",
  ...extra,
});

const productPiece = (p: Product) => piece(p.handle, "product", spanOf(p), spanOf(p), { handle: p.handle, look: lookOf(p) });
const videoPiece = (v: WallVideo) => (v.landscape ? piece(v.id, "video", 8, 5, { video: v, look: "video" }) : piece(v.id, "video", 5, 7, { video: v, look: "video" }));

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Hanging order: anchors spaced evenly through the run, and each next piece chosen so it
// doesn't look like the last two. Videos go at roughly a quarter, the middle and three quarters.
function hangingOrder(items: Piece[], videos: Piece[], rand: () => number) {
  const pool = items.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const anchors = pool.filter((p) => p.cols === 5);
  const rest = pool.filter((p) => p.cols !== 5);
  const order: Piece[] = [];
  const every = Math.max(2, Math.round(pool.length / Math.max(1, anchors.length)));
  while (anchors.length || rest.length) {
    const wantAnchor = anchors.length && (order.length % every === Math.floor(every / 2) || !rest.length);
    const src = wantAnchor ? anchors : rest;
    const recent = order.slice(-2).map((p) => p.look);
    const k = src.findIndex((p) => !recent.includes(p.look));
    order.push(src.splice(k === -1 ? 0 : k, 1)[0]);
  }
  // The full film sits dead centre; clips around a quarter and three quarters in.
  const slots = [0.5, 0.22, 0.78];
  videos.forEach((v, i) => order.splice(Math.round(order.length * slots[i % slots.length]), 0, v));
  return order;
}

// Dense first-fit onto a grid `cols` wide, like CSS grid's dense flow.
function pack(order: Piece[], cols: number) {
  const grid: boolean[][] = [];
  const free = (r: number, c: number, p: Piece) => {
    if (c + p.cols > cols) return false;
    for (let y = r; y < r + p.rows; y++) for (let x = c; x < c + p.cols; x++) if (grid[y]?.[x]) return false;
    return true;
  };
  const out: { p: Piece; r: number; c: number }[] = [];
  for (const p of order) {
    let done = false;
    for (let r = 0; !done; r++) {
      for (let c = 0; c <= cols - p.cols; c++) {
        if (free(r, c, p)) {
          for (let y = r; y < r + p.rows; y++) {
            grid[y] ??= [];
            for (let x = c; x < c + p.cols; x++) grid[y][x] = true;
          }
          out.push({ p, r, c });
          done = true;
          break;
        }
      }
    }
  }
  const rows = grid.length;
  let empty = 0;
  let ragged = 0;
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++)
      if (!grid[y]?.[x]) {
        empty++;
        // Holes along the bottom edge read as a piece left dangling, so they count extra.
        if (y >= rows - 7) ragged++;
      }
  return { out, rows, empty, ragged };
}

// Swap same-size pieces (so the packing stays valid) to push look-alikes apart in every
// direction, not just along the hanging order. Look-alikes repel by inverse-square distance.
function spreadLookAlikes(cells: { p: Piece; r: number; c: number }[], rand: () => number) {
  const centre = (k: { p: Piece; r: number; c: number }) => [(k.c + k.p.cols / 2) * UX, (k.r + k.p.rows / 2) * UY];
  const cost = (i: number) => {
    const a = cells[i];
    const [ax, ay] = centre(a);
    let sum = 0;
    for (let j = 0; j < cells.length; j++) {
      const b = cells[j];
      if (j === i || b.p.look !== a.p.look) continue;
      const [bx, by] = centre(b);
      sum += 1 / Math.max(1, ((ax - bx) ** 2 + (ay - by) ** 2) / 1e4);
    }
    return sum;
  };
  for (let n = 0; n < 4000; n++) {
    const i = Math.floor(rand() * cells.length);
    const j = Math.floor(rand() * cells.length);
    const a = cells[i];
    const b = cells[j];
    if (i === j || a.p.kind !== "product" || b.p.kind !== "product" || a.p.cols !== b.p.cols || a.p.rows !== b.p.rows || a.p.look === b.p.look) continue;
    const before = cost(i) + cost(j);
    [a.p, b.p] = [b.p, a.p];
    if (cost(i) + cost(j) >= before) [a.p, b.p] = [b.p, a.p];
  }
}

function build(items: Piece[], videos: Piece[], seed: number, aspect: number): Layout {
  const rand = mulberry32(seed);
  const order = hangingOrder(items, videos, rand);
  const area = order.reduce((a, p) => a + p.cols * p.rows, 0);
  // Try a range of board widths; keep the one with the fewest holes nearest the target shape.
  let best: ReturnType<typeof pack> & { cols: number; score: number } = { out: [], rows: 0, empty: 0, ragged: 0, cols: 0, score: Infinity };
  const widest = Math.max(...order.map((p) => p.cols));
  const ideal = Math.sqrt((area * aspect * UY) / UX);
  for (let cols = Math.max(widest, Math.floor(ideal * 0.7)); cols <= Math.ceil(ideal * 1.4); cols++) {
    const r = pack(order, cols);
    const shape = Math.abs((cols * UX) / (r.rows * UY) - aspect);
    const score = (r.empty + r.ragged * 2) / area + shape * 0.35;
    if (score < best.score) best = { ...r, cols, score };
  }
  spreadLookAlikes(best.out, rand);
  const placed: Placed[] = best.out.map(({ p, r, c }, i) => {
    // A little hand-hung irregularity, kept inside the piece's own cell so nothing ever overlaps.
    const jx = Math.round((rand() - 0.5) * 14);
    const jy = Math.round((rand() - 0.5) * 14);
    const rot = Math.round((rand() - 0.5) * (p.kind === "video" ? 2 : 4.4) * 10) / 10;
    return { ...p, x: c * UX + jx, y: r * UY + jy, rot, order: i };
  });
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (const p of placed) {
    bounds.minX = Math.min(bounds.minX, p.x);
    bounds.minY = Math.min(bounds.minY, p.y);
    bounds.maxX = Math.max(bounds.maxX, p.x + p.w);
    bounds.maxY = Math.max(bounds.maxY, p.y + p.h);
  }
  return { pieces: new Map(placed.map((p) => [p.id, p])), bounds };
}

const VIDEO_PIECES = WALL_VIDEOS.map(videoPiece);

function buildSet(aspectAll: number, aspectOne: number): Record<WallFilter, Layout> {
  return {
    all: build(products.map(productPiece), VIDEO_PIECES, 1015, aspectAll),
    ...(Object.fromEntries(
      collections.map((c, i) => [
        c.handle,
        // The SMFC film belongs with the SMFC drop; other collections are products only.
        build(products.filter((p) => p.collections.includes(c.handle)).map(productPiece), c.handle === "smfc" ? VIDEO_PIECES.slice(0, 2) : [], 77 + i * 31, aspectOne),
      ]),
    ) as Record<CollectionHandle, Layout>),
  };
}

// A landscape board for laptops and tablets, a portrait one for phones, so "see everything"
// fills the screen either way. Same pieces, same rules.
export const LAYOUT_SETS = { landscape: buildSet(1.7, 1.6), portrait: buildSet(0.62, 0.7) };
export type LayoutSet = Record<WallFilter, Layout>;

// Every piece that can be on the wall, in a stable order for rendering.
export const ALL_PIECES: Piece[] = [...LAYOUT_SETS.landscape.all.pieces.values()];
