import type { Metadata, Viewport } from "next";
import { Geist, Poppins } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const display = Poppins({ variable: "--font-display", subsets: ["latin"], weight: ["800"], display: "swap" });
const body = Geist({ variable: "--font-body", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://maal.seedhemaut.com"),
  title: { default: "MAAL | Seedhe Maut Official Merch", template: "%s | MAAL" },
  description: "Maal is back. The official Seedhe Maut merch wall: SMFC, SMX, Core, Vinyl and accessories, made in India.",
  openGraph: { title: "MAAL IS BACK", description: "The official Seedhe Maut merch wall.", siteName: "MAAL", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#e6e5e1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
