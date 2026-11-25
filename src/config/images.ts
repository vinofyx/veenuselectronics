/**
 * Photography used across the site.
 *
 * Free-licence photos from Unsplash (https://unsplash.com/license), stored locally in
 * /public/images/photos as responsive AVIF + WebP files (480/768/1080/1440 px wide).
 * They illustrate the type of work and equipment - they are NOT photos of the Veenus
 * Electronics workshop, so alt text describes the scene only.
 *
 * To use your own workshop photo: export it as <name>-480/-768/-1080/-1440 .webp and .avif
 * into /public/images/photos and point `file` below at <name>.
 */
export type Photo = { file: string; alt: string; width: number; height: number; widths: number[] };

const W = [480, 768, 1080, 1440];

export const photos = {
  /** Hands repairing a power board with capacitors, heatsink and screwdriver. */
  boardRepair: { file: "tv-power-board-repair", width: 1440, height: 960, widths: W, alt: "Technician repairing a power supply circuit board with a precision screwdriver" },
  /** Soldering on a dark circuit board. */
  soldering: { file: "circuit-board-soldering", width: 1440, height: 961, widths: W, alt: "Close-up of a technician soldering components on a circuit board" },
  /** Soldering iron on a PCB. */
  solderingIron: { file: "soldering-iron-pcb", width: 1440, height: 960, widths: W, alt: "Soldering iron working on a printed circuit board" },
  /** Hands working inside an electronic device. */
  componentWork: { file: "technician-electronic-components", width: 1440, height: 960, widths: W, alt: "Technician's hands working on electronic components inside a device" },
  /** Smart TV home screen on a TV stand. */
  smartTv: { file: "smart-tv-home-screen", width: 1440, height: 960, widths: W, alt: "Smart TV showing its home screen on a media unit" },
  /** Flat-screen TV in a living room with shelves. */
  livingRoomTv: { file: "led-tv-living-room", width: 1440, height: 960, widths: W, alt: "Flat-screen television in a living room" },
  /** Hand with a TV remote in front of a TV. */
  remote: { file: "smart-tv-remote", width: 1440, height: 960, widths: W, alt: "Hand holding a TV remote in front of a smart television" },
  /** Modern living room, wall-mounted TV. */
  modernTv: { file: "wall-mounted-tv-modern-room", width: 1440, height: 1920, widths: W, alt: "Wall-mounted television in a modern living room" },
  /** Screen showing static/noise - a TV fault. */
  screenNoise: { file: "tv-screen-static", width: 1440, height: 1800, widths: W, alt: "Television screen showing static noise" },
  /** Bookshelf speaker. */
  speaker: { file: "bookshelf-speaker", width: 1440, height: 960, widths: W, alt: "Bookshelf loudspeaker on a dark surface" },
  /* ---- Fault-specific photos (TV problems) ---- */
  /** Wall-mounted flat-screen TV, switched off. */
  tvOff: { file: "tv-not-turning-on", width: 1440, height: 1920, widths: W, alt: "Wall-mounted flat-screen TV switched off above a white media unit" },
  /** Flat-screen TV with a dark screen on a cabinet. */
  tvDarkScreen: { file: "tv-dark-screen-no-picture", width: 1440, height: 2160, widths: W, alt: "Flat-screen TV with a dark screen on a white cabinet" },
  /** Living room TV showing a black screen. */
  tvBlackScreen: { file: "tv-black-screen", width: 1440, height: 1055, widths: W, alt: "Living room with a wall-mounted TV showing a black screen" },
  /** Screen showing horizontal glitch lines. */
  screenLines: { file: "tv-screen-lines-fault", width: 1440, height: 782, widths: W, alt: "Screen showing distorted horizontal lines and colour bands" },
  /** Glowing LED strip - like a TV backlight strip. */
  ledStrip: { file: "led-backlight-strip", width: 1440, height: 960, widths: W, alt: "Strip of glowing LEDs, similar to a TV backlight strip" },
  /** Blue circuit board close-up. */
  circuitBlue: { file: "tv-mainboard-chips", width: 1440, height: 960, widths: W, alt: "Close-up of a blue electronic circuit board with chips" },
  /** Dark circuit board macro. */
  circuitDark: { file: "tv-power-supply-components", width: 1440, height: 960, widths: W, alt: "Macro view of components on a dark circuit board" },
  /** Wi-Fi router with antennas and status lights. */
  router: { file: "wifi-router", width: 1440, height: 960, widths: W, alt: "Wi-Fi router with antennas and a network cable connected" },
  /** Home theatre room with TV and speakers. */
  homeTheatre: { file: "home-theatre-tv-speakers", width: 1440, height: 1080, widths: W, alt: "Home theatre setup with a television and floor-standing speakers" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Path of one responsive size of a local photo. */
export function photoSrc(p: Photo, w: number, format: "webp" | "avif" = "webp"): string {
  return `/images/photos/${p.file}-${w}.${format}`;
}

/* Back-compat for older imports (next/image slots; local paths only). */
export const images: { hero: Photo | null; about: Photo | null } = { hero: null, about: null };

/** Page-specific photograph for each landing page. */
const PAGE_PHOTOS: Record<string, PhotoKey> = {
  "/tv-repair/led-tv-repair": "livingRoomTv",
  "/tv-repair/lcd-tv-repair": "componentWork",
  "/tv-repair/smart-tv-repair": "smartTv",
  "/tv-repair/oled-tv-repair": "modernTv",
  "/tv-repair/qled-tv-repair": "remote",
  "/tv-repair/android-tv-repair": "smartTv",
  "/tv-repair/4k-tv-repair": "livingRoomTv",
  "/tv-problems/tv-not-turning-on": "tvOff",
  "/tv-problems/tv-sound-but-no-picture": "tvDarkScreen",
  "/tv-problems/tv-black-screen": "tvBlackScreen",
  "/tv-problems/tv-screen-lines": "screenLines",
  "/tv-problems/tv-backlight-repair": "ledStrip",
  "/tv-problems/tv-motherboard-repair": "circuitBlue",
  "/tv-problems/tv-power-supply-repair": "boardRepair",
  "/tv-problems/tv-hdmi-problem": "componentWork",
  "/tv-problems/tv-wifi-problem": "router",
  "/tv-problems/tv-restarting-problem": "remote",
  "/tv-problems/tv-screen-repair": "modernTv",
  "/electronics-repair/home-theatre-repair": "homeTheatre",
  "/electronics-repair/speaker-repair": "speaker",
  "/electronics-repair/amplifier-repair": "boardRepair",
  "/electronics-repair/projector-repair": "componentWork",
  "/electronics-repair/dvd-player-repair": "solderingIron",
  "/electronics-repair/set-top-box-repair": "remote",
};

/** Homepage problem tiles: avoid repeating the hero's photos on the same page. */
export const HOME_PROBLEM_PHOTOS: Record<string, PhotoKey> = {
  ...PAGE_PHOTOS,
  "/tv-problems/tv-power-supply-repair": "circuitDark",
};

export function photoForPath(path: string, fallback: PhotoKey = "boardRepair"): PhotoKey {
  return PAGE_PHOTOS[path] ?? fallback;
}
