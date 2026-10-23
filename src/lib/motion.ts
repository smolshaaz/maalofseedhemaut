// The same sampled springs as --spring-soft / --spring-bouncy in globals.css,
// for Web Animations, which cannot read CSS variables.
export const SPRING_SOFT =
  "linear(0, 0.062, 0.203, 0.371, 0.535, 0.677, 0.792, 0.879, 0.94, 0.981, 1.005, 1.018, 1.023, 1.023, 1.02, 1.017, 1.013, 1.009, 1.006, 1.004, 1.002, 1.001, 1, 1, 1, 0.999, 0.999, 1, 1, 1, 1)";
export const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
