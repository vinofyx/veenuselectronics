export type NavLink = { label: string; href: string };
export type NavItem = NavLink | { label: string; href: string; children: NavLink[] };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "TV Repair",
    href: "/tv-repair",
    children: [
      { label: "LED TV Repair", href: "/tv-repair/led-tv-repair" },
      { label: "LCD TV Repair", href: "/tv-repair/lcd-tv-repair" },
      { label: "Smart TV Repair", href: "/tv-repair/smart-tv-repair" },
      { label: "OLED TV Repair", href: "/tv-repair/oled-tv-repair" },
      { label: "QLED TV Repair", href: "/tv-repair/qled-tv-repair" },
      { label: "Android TV Repair", href: "/tv-repair/android-tv-repair" },
      { label: "4K TV Repair", href: "/tv-repair/4k-tv-repair" },
    ],
  },
  {
    label: "TV Problems",
    href: "/tv-problems",
    children: [
      { label: "TV Not Turning On", href: "/tv-problems/tv-not-turning-on" },
      { label: "TV Screen Repair", href: "/tv-problems/tv-screen-repair" },
      { label: "TV Black Screen", href: "/tv-problems/tv-black-screen" },
      { label: "Sound But No Picture", href: "/tv-problems/tv-sound-but-no-picture" },
      { label: "TV Display Lines", href: "/tv-problems/tv-screen-lines" },
      { label: "TV Backlight Repair", href: "/tv-problems/tv-backlight-repair" },
      { label: "TV Motherboard Repair", href: "/tv-problems/tv-motherboard-repair" },
      { label: "TV Power Supply Repair", href: "/tv-problems/tv-power-supply-repair" },
    ],
  },
  {
    label: "Other Electronics",
    href: "/electronics-repair",
    children: [
      { label: "Home Theatre Repair", href: "/electronics-repair/home-theatre-repair" },
      { label: "Speaker Repair", href: "/electronics-repair/speaker-repair" },
      { label: "Amplifier Repair", href: "/electronics-repair/amplifier-repair" },
      { label: "Projector Repair", href: "/electronics-repair/projector-repair" },
      { label: "Set Top Box Repair", href: "/electronics-repair/set-top-box-repair" },
    ],
  },
  { label: "Brands We Repair", href: "/tv-brand-repair" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

export const footerLinks = {
  company: [
    { label: "About Us", href: "/about-us" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "Customer Reviews", href: "/customer-reviews" },
    { label: "FAQ", href: "/faq" },
    { label: "Repair Guides", href: "/blog" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms and Conditions", href: "/terms-and-conditions" },
  ],
};
