import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { BusinessProvider } from "@/components/BusinessProvider";
import { JsonLd } from "@/components/JsonLd";
import { getBusiness } from "@/lib/business";
import { localBusinessSchema, organizationSchema } from "@/lib/schema";

// Pages are static and refreshed hourly, or immediately when an admin saves business details.
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const business = await getBusiness();
  return (
    <BusinessProvider value={business}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow">
        Skip to content
      </a>
      <JsonLd data={[localBusinessSchema(business), organizationSchema(business)]} />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileActionBar />
      <FloatingWhatsApp />
    </BusinessProvider>
  );
}
