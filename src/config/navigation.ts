export type NavLink = { label: string; href: string; description?: string };
export type NavItem = NavLink | { label: string; href: string; children: NavLink[]; viewAll?: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "TV Repair",
    href: "/tv-repair",
    viewAll: "All TV repair services",
    children: [
      { label: "LED TV Repair", href: "/tv-repair/led-tv-repair", description: "Backlight, panel and board faults" },
      { label: "LCD TV Repair", href: "/tv-repair/lcd-tv-repair", description: "CCFL, inverter and display issues" },
      { label: "Smart TV Repair", href: "/tv-repair/smart-tv-repair", description: "Software, Wi-Fi and boot problems" },
      { label: "OLED TV Repair", href: "/tv-repair/oled-tv-repair", description: "Power, board and image faults" },
      { label: "QLED TV Repair", href: "/tv-repair/qled-tv-repair", description: "Backlight and processing faults" },
      { label: "Android TV Repair", href: "/tv-repair/android-tv-repair", description: "Boot loops, apps and updates" },
      { label: "4K TV Repair", href: "/tv-repair/4k-tv-repair", description: "UHD boards and HDMI faults" },
    ],
  },
  {
    label: "TV Problems",
    href: "/tv-problems",
    viewAll: "All TV problems",
    children: [
      { label: "TV Not Turning ON", href: "/tv-problems/tv-not-turning-on" },
      { label: "Sound But No Picture", href: "/tv-problems/tv-sound-but-no-picture" },
      { label: "TV Black Screen", href: "/tv-problems/tv-black-screen" },
      { label: "TV Display Lines", href: "/tv-problems/tv-screen-lines" },
      { label: "TV Backlight Problem", href: "/tv-problems/tv-backlight-repair" },
      { label: "TV Motherboard Problem", href: "/tv-problems/tv-motherboard-repair" },
      { label: "TV Power Supply Problem", href: "/tv-problems/tv-power-supply-repair" },
      { label: "TV Keeps Restarting", href: "/tv-problems/tv-restarting-problem" },
      { label: "TV WiFi Not Working", href: "/tv-problems/tv-wifi-problem" },
    ],
  },
  {
    label: "Other Electronics",
    href: "/electronics-repair",
    viewAll: "All electronics repairs",
    children: [
      { label: "Home Theatre Repair", href: "/electronics-repair/home-theatre-repair" },
      { label: "Speaker Repair", href: "/electronics-repair/speaker-repair" },
      { label: "Amplifier Repair", href: "/electronics-repair/amplifier-repair" },
      { label: "Projector Repair", href: "/electronics-repair/projector-repair" },
      { label: "DVD Player Repair", href: "/electronics-repair/dvd-player-repair" },
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
