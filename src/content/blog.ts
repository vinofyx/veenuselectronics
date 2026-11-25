import type { ContentSection } from "./types";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date of publication */
  date: string;
  readingMinutes: number;
  sections: ContentSection[];
  related: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "tv-sound-but-no-picture-torch-test",
    title: "TV Has Sound But No Picture? Try the Torch Test First",
    description:
      "A simple 30-second check that tells you whether your TV's dark screen is caused by the backlight or something else - and what to do next.",
    date: "2026-11-01",
    readingMinutes: 4,
    sections: [
      {
        heading: "Why the screen can be dark while the TV still works",
        body: "LED and QLED TVs make the picture on an LCD layer and light it from behind with strips of LEDs. If the LEDs stop working, the picture is still being produced - you just cannot see it. That is why the sound keeps playing normally.",
      },
      {
        heading: "How to do the torch test",
        bullets: [
          "Switch the TV on and open a bright menu, such as Settings.",
          "Turn off the room lights.",
          "Hold your phone torch 5-10 cm from the screen at an angle.",
          "Move it slowly across the screen and look closely.",
        ],
      },
      {
        heading: "What the result means",
        bullets: [
          "You can faintly see the menu: the backlight has most likely failed. This is usually repairable.",
          "The screen is completely blank: the problem is more likely the T-con board, panel connection or main board.",
          "Nothing works, including sound: see our guide on TVs that won't turn on.",
        ],
      },
      {
        heading: "What not to do",
        body: "Do not open the back cover. The power supply can hold a dangerous charge, and LED strips sit behind fragile diffuser sheets and the panel itself. Share the torch-test result with a technician instead - it speeds up diagnosis.",
      },
    ],
    related: ["/tv-problems/tv-sound-but-no-picture", "/tv-problems/tv-backlight-repair"],
  },
  {
    slug: "protect-tv-from-voltage-fluctuations",
    title: "How to Protect Your TV From Voltage Fluctuations",
    description:
      "Power surges are a common reason TVs stop working. Practical steps to reduce the risk for LED, smart and OLED TVs.",
    date: "2026-11-08",
    readingMinutes: 5,
    sections: [
      {
        heading: "Why surges damage TVs",
        body: "Sudden voltage spikes - from grid switching, lightning or heavy appliances starting - stress the TV's power supply board. Repeated stress weakens capacitors and regulators until the board fails, often showing up as a TV that will not turn on.",
      },
      {
        heading: "Practical protection",
        bullets: [
          "Use a quality surge protector rated for electronics, or a stabiliser designed for LED/smart TVs.",
          "Unplug the TV and set top box during thunderstorms.",
          "Protect the antenna/cable and HDMI-connected devices too - surges can enter through any connected cable.",
          "Make sure the socket is properly earthed.",
          "After a power cut, wait a minute for the supply to settle before switching on.",
        ],
      },
      {
        heading: "Signs your TV may already be affected",
        bullets: ["Clicking when switched on", "Turning off by itself", "Standby light blinking", "HDMI ports stopped working after a storm"],
      },
    ],
    related: ["/tv-problems/tv-power-supply-repair", "/tv-problems/tv-not-turning-on"],
  },
  {
    slug: "find-your-tv-model-number",
    title: "How to Find Your TV's Model Number (and Why It Matters)",
    description:
      "Your TV's model number tells a technician the exact panel and boards inside. Here is where to find it for common brands.",
    date: "2026-11-15",
    readingMinutes: 3,
    sections: [
      {
        heading: "Why the model number matters",
        body: "Two TVs that look identical can use different panels and boards. The model number lets a technician check part compatibility and known faults before visiting, which saves time and avoids a second trip.",
      },
      {
        heading: "Where to look",
        bullets: [
          "The sticker on the back of the TV - take a clear photo of the whole label.",
          "Smart TVs: Settings > Support / About / Device Preferences > About.",
          "The original box or purchase invoice.",
          "The user manual or warranty card.",
        ],
      },
      {
        heading: "What to send us",
        body: "Share the model number when you call, or send a photo of the label along with a photo of the problem on WhatsApp. If the label is unreadable, just tell us the brand and screen size.",
      },
    ],
    related: ["/book-repair", "/tv-brand-repair"],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
