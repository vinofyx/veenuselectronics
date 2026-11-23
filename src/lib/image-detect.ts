/** Image type detection by file content ("magic bytes"). Pure - safe to unit test. */

/** Checks magic bytes so a renamed non-image file cannot be uploaded. Returns a safe extension or null. */
export function detectImage(buf: Uint8Array): "jpg" | "png" | "webp" | "heic" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  const ascii = (s: number, e: number) => String.fromCharCode(...Array.from(buf.slice(s, e)));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(4, 8) === "ftyp" && /^(heic|heix|hevc|hevx|mif1|msf1)$/.test(ascii(8, 12))) return "heic";
  return null;
}

export const MIME_BY_EXT = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", heic: "image/heic" } as const;
