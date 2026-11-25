import { ShieldAlert, Tv } from "lucide-react";
import { Photo } from "./Photo";

/** Right-hand hero panel for brand pages: brand wordmark (plain text, no logos) over a TV photo. */
export function BrandHeroPanel({ brand, summary }: { brand: string; summary: string }) {
  return (
    <div className="relative hidden lg:block">
      <div className="relative aspect-[5/4] overflow-hidden rounded-3xl ring-1 ring-white/10">
        <Photo name="livingRoomTv" width={620} height={496} alt="" sizes="40vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/10" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-300">
            <Tv className="h-4 w-4" aria-hidden /> Televisions we repair
          </p>
          <p className="mt-2 font-display text-[54px] font-extrabold leading-none tracking-tight text-white">{brand}</p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-brand-200">{summary}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12.5px] text-brand-100">
            <ShieldAlert className="h-3.5 w-3.5 text-accent-300" aria-hidden /> Independent service &middot; not a {brand} service centre
          </p>
        </div>
      </div>
    </div>
  );
}
