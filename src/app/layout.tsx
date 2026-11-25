import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { getBusiness } from "@/lib/business";
import { Analytics } from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
// Variable fonts: one file each covers every weight used (fewer font requests than per-weight files).
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const b = await getBusiness();
  return {
  metadataBase: new URL(site.url),
  title: {
    default: `${b.name} | ${site.tagline}`,
    template: `%s | ${b.name}`,
  },
  description:
    "Veenus Electronics - expert LED, LCD, Smart, OLED and QLED TV repair, plus home theatre, speaker, amplifier, projector and set top box repairs. Call, WhatsApp or book a repair.",
  applicationName: b.name,
  formatDetection: { telephone: false },
  verification: site.gscVerification ? { google: site.gscVerification } : undefined,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: { url: "/brand/apple-icon.png", sizes: "180x180" },
  },
  };
}

export const viewport: Viewport = {
  themeColor: "#102D4F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
