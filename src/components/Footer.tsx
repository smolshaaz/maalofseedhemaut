import Link from "next/link";
import { STORE_ORIGIN } from "@/data/products";
import { Reveal } from "./Reveal";
import { Signature } from "./Signature";

const SOCIAL = [
  ["Instagram", "https://www.instagram.com/seedhemaut/"],
  ["Spotify", "https://open.spotify.com/artist/2oBG74gAocPMFv6Ij9ykdo"],
  ["YouTube", "https://www.youtube.com/@SeedheMaut"],
  ["X", "https://x.com/SeedheMaut"],
  ["SoundCloud", "https://soundcloud.com/seedhemaut-music"],
  ["Facebook", "https://m.facebook.com/SeedheMaut/"],
];

const POLICIES = [
  ["Privacy Policy", `${STORE_ORIGIN}/pages/privacy-policy`],
  ["Terms & Conditions", `${STORE_ORIGIN}/pages/terms-and-conditions`],
  ["Return Policy", `${STORE_ORIGIN}/pages/refund-and-returns-policy`],
];

// Always the black of the logo card, so the signature reads exactly as theirs does.
export function Footer() {
  return (
    <footer className="mt-28 bg-[#0b0b0b] px-4 pb-28 pt-24 text-paper sm:mt-36 sm:px-8">
      <Reveal>
        <p className="display text-[clamp(56px,13.5vw,220px)] leading-[0.84]">
          <Signature>
            Tera bhai
            <br />
            Seedhe Maut
          </Signature>
        </p>
      </Reveal>
      <div className="mt-14 grid gap-8 text-[13px] sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-paper/45">Shop</span>
          <Link href="/" className="w-fit hover:text-[#ff3b30]">The wall</Link>
          <Link href="/shop" className="w-fit hover:text-[#ff3b30]">Index</Link>
          <Link href="/collections" className="w-fit hover:text-[#ff3b30]">Collections</Link>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-paper/45">Follow</span>
          {SOCIAL.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="w-fit hover:text-[#ff3b30]">
              {label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-paper/45">Help</span>
          <Link href="/contact" className="w-fit hover:text-[#ff3b30]">Contact</Link>
          {POLICIES.map(([label, href]) => (
            <a key={label} href={href} rel="noopener" className="w-fit hover:text-[#ff3b30]">
              {label}
            </a>
          ))}
        </div>
      </div>
      <p className="mt-12 text-[12px] text-paper/45">© {new Date().getFullYear()} Seedhe Maut. Made in India.</p>
    </footer>
  );
}
