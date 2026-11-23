"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Shown if a page fails to render (e.g. a temporary database outage). Keeps contact routes available. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="grid min-h-[60vh] place-items-center px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-slate-600">This page could not be loaded right now. Please try again, or contact us directly.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">Try again</button>
          <Link href="/contact-us" className="btn-outline">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
