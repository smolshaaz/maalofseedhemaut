// Shopify's CDN resizes on the fly with ?width=, so next/image never has to.
export default function shopifyLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("https://cdn.shopify.com/")) return src;
  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}

export const shopifyImage = (src: string, width: number) => shopifyLoader({ src, width });
