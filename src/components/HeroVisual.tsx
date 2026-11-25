import { Photo } from "./Photo";

/** Homepage hero: one large, clean board-repair photograph. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] xl:max-w-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-800 shadow-[0_32px_64px_-32px_rgba(9,29,51,0.45)]">
        <Photo name="boardRepair" width={720} height={540} priority sizes="(min-width:1280px) 46vw, 100vw" className="object-[center_42%]" />
      </div>
    </div>
  );
}
