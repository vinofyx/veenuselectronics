import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-surface px-4">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you were looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-primary">Go to home</Link>
          <Link href="/book-repair" className="btn-accent">Book a repair</Link>
        </div>
      </div>
    </main>
  );
}
