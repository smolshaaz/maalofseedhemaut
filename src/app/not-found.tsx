import Link from "next/link";
import { TopLogo } from "@/components/Chrome";
import { ArrowIcon } from "@/components/Icons";
import { WallBackdrop } from "@/components/WallBackdrop";

export default function NotFound() {
  return (
    <main className="relative grid h-dvh place-items-center overflow-hidden">
      <WallBackdrop blur={8} />
      <div className="absolute inset-0 bg-wall/60" />
      <TopLogo />
      <div className="glass relative mx-4 max-w-[420px] rounded-[26px] p-6 text-center">
        <p className="display text-[64px] leading-none">404</p>
        <h1 className="display mt-3 text-[22px]">This print fell off the wall</h1>
        <p className="mt-2 text-[14px] text-ink/65">The page you asked for isn&apos;t here, or the drop has ended.</p>
        <Link href="/" className="mx-auto mt-5 flex h-11 w-fit items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-paper">
          Back to the wall <ArrowIcon />
        </Link>
      </div>
    </main>
  );
}
