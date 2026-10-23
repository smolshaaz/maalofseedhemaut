// The Seedhe Maut logo move: one slash cuts the words, grey on the left,
// red on the right, and the red half drops a notch. Two clipped copies of the
// same text, so it works on any words at any size.
export function Signature({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`signature relative inline-block ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="signature-a block">
        {children}
      </span>
      <span aria-hidden className="signature-b absolute inset-0 block">
        {children}
      </span>
    </span>
  );
}
