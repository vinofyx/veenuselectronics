"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="card mx-auto max-w-lg p-6 text-center">
      <h1 className="text-xl font-bold">Could not load this page</h1>
      <p className="mt-2 text-sm text-slate-600">
        The database may be temporarily unavailable. {error.digest ? `Reference: ${error.digest}` : ""}
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-4">Try again</button>
    </div>
  );
}
