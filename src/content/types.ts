import type { BRANDS, EQUIPMENT_TYPES, PROBLEMS } from "@/lib/constants";

export type Faq = { q: string; a: string };

export type ContentSection = {
  heading: string;
  body?: string;
  bullets?: string[];
};

export type IconKey =
  | "tv"
  | "monitor"
  | "smart"
  | "sparkles"
  | "layers"
  | "android"
  | "fourk"
  | "power"
  | "screenOff"
  | "volume"
  | "lines"
  | "sun"
  | "cpu"
  | "plug"
  | "hdmi"
  | "wifi"
  | "refresh"
  | "speaker"
  | "amp"
  | "projector"
  | "disc"
  | "box"
  | "home";

export type LandingPage = {
  slug: string;
  /** H1 on the page */
  title: string;
  /** Short label used on cards and in menus */
  label: string;
  /** One-line summary for cards */
  summary: string;
  metaTitle: string;
  metaDescription: string;
  icon: IconKey;
  intro: string[];
  sections: ContentSection[];
  faqs: Faq[];
  /** Internal links (hrefs) to related pages */
  related: string[];
  /** Pre-fill values for the enquiry form on this page */
  prefill?: {
    equipment_type?: (typeof EQUIPMENT_TYPES)[number];
    problem?: (typeof PROBLEMS)[number];
    brand?: (typeof BRANDS)[number];
  };
};
