import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { getBusiness } from "@/lib/business";
import { Analytics } from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-poppins", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const b = await getBusiness();
  return {
  metadataBase: new URL(site.url),
  title: {
    default: `${b.name} | ${site.tagline}`,
    template: `%s | ${b.name}`,
  },
  description:
    "Veenus Electronics - expert LED, LCD, Smart, OLED and QLED TV repair, plus home theatre, speaker, amplifier, projector and set top box repairs. Book a repair enquiry, call or WhatsApp.",
  applicationName: b.name,
  formatDetection: { telephone: false },
  verification: site.gscVerification ? { google: site.gscVerification } : undefined,
  icons: { icon: b.logoUrl || "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: "#12345A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
