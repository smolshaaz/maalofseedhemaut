// Re-mounts on every navigation, so each page fades in. Opacity only: a transform here
// would break the fixed-position wall and the glass blur underneath.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
