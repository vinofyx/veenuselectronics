import type { LandingPage } from "./types";

const DIAGNOSIS_STEPS = [
  "We record the symptoms you describe and any error codes or blinking-light patterns.",
  "The TV is powered on a protected bench supply so faults are not made worse during testing.",
  "Power supply, backlight, main board and panel are checked in sequence to isolate the faulty section.",
  "You receive a clear explanation and an estimate before any repair work begins.",
];

export const tvServices: LandingPage[] = [
  {
    slug: "led-tv-repair",
    title: "LED TV Repair",
    label: "LED TV Repair",
    summary: "Backlight, power, board and display faults on LED televisions of all common sizes.",
    metaTitle: "LED TV Repair Service | Backlight, Power & Board Repair",
    metaDescription:
      "LED TV repair for backlight failure, no power, display lines, no picture and board faults. Get an inspection and a transparent estimate from Veenus Electronics.",
    icon: "tv",
    intro: [
      "LED televisions are LCD panels lit by rows of small LEDs behind (or at the edge of) the screen. Most faults we see are not the panel itself but the components that light it, power it and feed it a picture - and those can usually be repaired at a fraction of the cost of a new TV.",
      "Veenus Electronics inspects LED TVs component by component so you know exactly what has failed and what the repair involves before you approve it.",
    ],
    sections: [
      {
        heading: "Common LED TV faults",
        bullets: [
          "Sound is present but the screen stays dark (often LED backlight strips)",
          "Picture is visible only when a torch is shone on the screen",
          "TV does not power on, or the standby light blinks repeatedly",
          "Vertical or horizontal lines, half-screen or split-screen display",
          "Dim, patchy or uneven brightness and dark corners",
          "TV turns off by itself after a few minutes",
          "No signal from HDMI or set top box inputs",
        ],
      },
      {
        heading: "What we can repair",
        bullets: [
          "Replacement of failed LED backlight strips and the LED driver circuit",
          "Power supply board diagnosis and component-level repair or board replacement",
          "Main board (motherboard) faults including firmware and port issues",
          "T-con board and panel connection problems that cause lines or garbled pictures",
          "Speaker, remote sensor and button panel faults",
        ],
      },
      {
        heading: "How we diagnose an LED TV",
        bullets: DIAGNOSIS_STEPS,
      },
      {
        heading: "When repair may not be worthwhile",
        body: "If the glass panel itself is cracked or the panel has internal damage, a replacement panel can cost close to the price of a new TV. We will tell you honestly when that is the case so you can decide - we never begin work without your approval.",
      },
    ],
    faqs: [
      {
        q: "My LED TV has sound but no picture. Is it the screen?",
        a: "Usually not. The most common cause is failed LED backlight strips, which make the screen look completely black while the TV is still working. Shine a torch close to the screen - if you can faintly see the picture, the backlight is the likely culprit.",
      },
      {
        q: "Is it worth repairing an LED TV?",
        a: "For backlight, power supply and most board faults, repair is normally much cheaper than replacement. If the panel is physically damaged the economics change, and we will explain your options before any work starts.",
      },
      {
        q: "Do you repair large LED TVs?",
        a: "Yes. Tell us the screen size when you submit your enquiry so we can plan whether a home visit, pickup or workshop repair is most practical.",
      },
    ],
    related: [
      "/tv-problems/tv-backlight-repair",
      "/tv-problems/tv-sound-but-no-picture",
      "/tv-problems/tv-power-supply-repair",
      "/tv-repair/smart-tv-repair",
    ],
    prefill: { equipment_type: "LED TV" },
  },
  {
    slug: "lcd-tv-repair",
    title: "LCD TV Repair",
    label: "LCD TV Repair",
    summary: "Repairs for older CCFL-lit LCD televisions, inverter boards and power faults.",
    metaTitle: "LCD TV Repair | Inverter, Power Supply & Display Faults",
    metaDescription:
      "Repair for older LCD televisions - inverter board, CCFL backlight, power supply and display faults. Book an inspection with Veenus Electronics.",
    icon: "monitor",
    intro: [
      "Older LCD televisions are usually lit by fluorescent tubes (CCFL) driven by an inverter board, rather than LEDs. They have their own typical failure points, and parts availability varies by model and age.",
      "If your LCD TV is still a good fit for the room, a repair can keep it working for years. We check parts availability first so you are not left waiting on a part that no longer exists.",
    ],
    sections: [
      {
        heading: "Typical LCD TV problems",
        bullets: [
          "Picture appears for a second, then the screen goes dark",
          "Flickering or a reddish/pinkish tint across the screen",
          "No power or a clicking sound when switched on",
          "Lines or a faded image on part of the screen",
          "Humming or buzzing from inside the TV",
        ],
      },
      {
        heading: "Repairs we carry out",
        bullets: [
          "Inverter board diagnosis and repair",
          "Power supply capacitor and component repair",
          "Backlight lamp assessment",
          "Main board and input faults",
          "Audio amplifier and speaker faults",
        ],
      },
      { heading: "Our diagnosis process", bullets: DIAGNOSIS_STEPS },
      {
        heading: "Parts availability for older models",
        body: "Some LCD models are no longer manufactured. Where an exact part is not available we will say so before you commit, and suggest a compatible alternative only where one is genuinely suitable.",
      },
    ],
    faqs: [
      {
        q: "How do I know if my TV is LCD or LED?",
        a: "Check the model sticker on the back or the user manual. LED TVs are generally slimmer. If you are unsure, just choose 'LCD TV' or 'Other' on the enquiry form and share the model number - we will work it out.",
      },
      {
        q: "Can an old LCD TV still be repaired?",
        a: "In many cases yes, especially power supply and inverter faults. It depends on the availability of parts for your specific model, which we confirm during inspection.",
      },
    ],
    related: ["/tv-repair/led-tv-repair", "/tv-problems/tv-not-turning-on", "/tv-problems/tv-screen-lines"],
    prefill: { equipment_type: "LCD TV" },
  },
  {
    slug: "smart-tv-repair",
    title: "Smart TV Repair",
    label: "Smart TV Repair",
    summary: "Hardware and software faults on smart TVs - boot loops, apps, Wi-Fi and display.",
    metaTitle: "Smart TV Repair | Boot Loop, Wi-Fi, Software & Hardware",
    metaDescription:
      "Smart TV repair for boot loops, stuck logo, Wi-Fi failures, apps not opening, no picture and board faults. Inspection and clear estimates from Veenus.",
    icon: "smart",
    intro: [
      "A smart TV is a television and a small computer in one case. Faults can be hardware (power, backlight, panel, main board) or software (firmware corruption, storage errors, failed updates) - and the symptoms often look similar.",
      "We separate the two carefully. A software problem should not be charged as a hardware repair, and a failing board should not be patched with a reset that only works for a week.",
    ],
    sections: [
      {
        heading: "Smart TV issues we handle",
        bullets: [
          "Stuck on the brand logo or restarting in a loop",
          "Apps crashing, very slow menus or 'storage full' errors",
          "Wi-Fi turned off, greyed out or not finding networks",
          "Screen mirroring, Bluetooth or voice remote not working",
          "No picture, no power or dark screen with sound",
          "HDMI ARC / eARC problems with soundbars",
        ],
      },
      {
        heading: "Software and firmware",
        body: "Where a model supports it, we can reinstall or update firmware using the manufacturer's official update files. We will never install unofficial or modified software on your TV.",
      },
      {
        heading: "Hardware repairs",
        bullets: [
          "Main board repair or replacement (including eMMC storage faults)",
          "Wi-Fi / Bluetooth module replacement",
          "Power supply and backlight repair",
          "Panel connection and T-con faults",
        ],
      },
      { heading: "How we diagnose", bullets: DIAGNOSIS_STEPS },
    ],
    faqs: [
      {
        q: "My smart TV keeps restarting. Will a factory reset fix it?",
        a: "Sometimes - if the cause is a corrupted app or setting. If the TV restarts before you can reach the menu, the fault is more likely firmware storage or the power supply, which needs inspection. Note that a factory reset removes your logins and settings.",
      },
      {
        q: "Will my apps and accounts be erased during repair?",
        a: "Some repairs, such as firmware reinstallation or main board replacement, will reset the TV. We tell you in advance, and you will need to sign in to your apps again afterwards.",
      },
    ],
    related: [
      "/tv-problems/tv-restarting-problem",
      "/tv-problems/tv-wifi-problem",
      "/tv-repair/android-tv-repair",
      "/tv-problems/tv-motherboard-repair",
    ],
    prefill: { equipment_type: "Smart TV" },
  },
  {
    slug: "oled-tv-repair",
    title: "OLED TV Repair",
    label: "OLED TV Repair",
    summary: "Careful diagnosis of premium OLED televisions - power, boards and panel faults.",
    metaTitle: "OLED TV Repair | Power, Board & Display Diagnosis",
    metaDescription:
      "OLED TV repair and diagnosis for no power, no picture, lines, and board faults. Careful handling of premium panels by Veenus Electronics. Request an inspection.",
    icon: "sparkles",
    intro: [
      "OLED panels create their own light at every pixel - there is no backlight. That means some familiar LED-TV repairs do not apply, and the panel is very thin and easy to damage if handled incorrectly.",
      "We treat OLED TVs as the premium products they are: careful transport, padded work surfaces and an honest assessment of whether a repair makes financial sense.",
    ],
    sections: [
      {
        heading: "OLED faults we diagnose",
        bullets: [
          "No power, or the TV switches on and immediately off",
          "Vertical lines or a band of incorrect colours",
          "Picture flickering or dimming suddenly",
          "No picture with sound present",
          "Main board, power board and timing (T-con) board faults",
        ],
      },
      {
        heading: "About burn-in and image retention",
        body: "Temporary image retention often clears with the TV's own pixel-refresh routine. Permanent burn-in is a characteristic of the panel and cannot be repaired by replacing a board - only a panel replacement removes it. We will tell you which one you have.",
      },
      {
        heading: "Repairs we carry out",
        bullets: [
          "Power supply board repair or replacement",
          "Main board and T-con board diagnosis",
          "Panel connection and cable faults",
          "Firmware recovery using official update files where supported",
        ],
      },
      { heading: "How we diagnose", bullets: DIAGNOSIS_STEPS },
    ],
    faqs: [
      {
        q: "Can OLED burn-in be repaired?",
        a: "True burn-in is permanent damage to the organic pixels and needs a panel replacement, which is often expensive. Temporary retention can usually be cleared using the TV's pixel-refresh option.",
      },
      {
        q: "Is it safe to transport an OLED TV?",
        a: "OLED panels must be carried upright and supported across the whole frame. If a workshop repair is needed we will advise on safe transport or discuss a pickup option.",
      },
    ],
    related: ["/tv-repair/qled-tv-repair", "/tv-problems/tv-screen-lines", "/tv-problems/tv-power-supply-repair"],
    prefill: { equipment_type: "OLED TV" },
  },
  {
    slug: "qled-tv-repair",
    title: "QLED TV Repair",
    label: "QLED TV Repair",
    summary: "QLED and quantum-dot TV repairs - backlight, local dimming, boards and smart features.",
    metaTitle: "QLED TV Repair | Backlight, Dimming & Board Repairs",
    metaDescription:
      "QLED TV repair for backlight failure, local-dimming problems, no picture, lines and smart features. Inspection and transparent estimate from Veenus Electronics.",
    icon: "layers",
    intro: [
      "QLED televisions use a quantum-dot layer in front of an LED backlight to produce richer colours. Underneath, they share much of their design with LED TVs - including backlights, power boards and main boards that can fail.",
      "Many QLED models also use full-array local dimming, which adds dimming zones and driver circuits that need specific diagnosis.",
    ],
    sections: [
      {
        heading: "QLED problems we see",
        bullets: [
          "Screen dark with sound present",
          "Blotchy brightness, blooming or zones stuck bright or dark",
          "Colour tint or a blue/purple cast on part of the image",
          "TV not turning on, or standby light blinking",
          "Smart features, Wi-Fi or One Connect box issues (on supported models)",
        ],
      },
      {
        heading: "Repairs we carry out",
        bullets: [
          "LED backlight strip and LED driver repair",
          "Local dimming board diagnosis",
          "Power supply and main board repair or replacement",
          "Connection box and cable fault finding",
        ],
      },
      { heading: "How we diagnose", bullets: DIAGNOSIS_STEPS },
    ],
    faqs: [
      {
        q: "Is QLED the same as OLED?",
        a: "No. QLED is an LED-backlit LCD TV with a quantum-dot colour layer. OLED has no backlight. The repairs are quite different, so please select the correct type on the enquiry form if you know it.",
      },
      {
        q: "Why does my QLED TV have bright patches?",
        a: "It may be a failing LED in the backlight, a local-dimming fault or a displaced diffuser sheet inside the TV. An inspection identifies which one.",
      },
    ],
    related: ["/tv-repair/led-tv-repair", "/tv-problems/tv-backlight-repair", "/tv-brand-repair/samsung-tv-repair"],
    prefill: { equipment_type: "QLED TV" },
  },
  {
    slug: "android-tv-repair",
    title: "Android TV & Google TV Repair",
    label: "Android TV Repair",
    summary: "Android TV and Google TV boot problems, storage errors, apps and hardware faults.",
    metaTitle: "Android TV Repair | Boot Loop, Storage & Wi-Fi Problems",
    metaDescription:
      "Android TV and Google TV repair for boot loops, stuck logo, storage full, crashing apps, Wi-Fi and hardware faults. Request an inspection at Veenus.",
    icon: "android",
    intro: [
      "Android TV and Google TV are used by many popular brands. Because the software runs on internal flash storage, wear on that storage and failed updates are common causes of slow, freezing or non-booting TVs.",
      "We start with safe software steps and move to hardware diagnosis only when needed.",
    ],
    sections: [
      {
        heading: "Common Android TV problems",
        bullets: [
          "Stuck on the boot animation or brand logo",
          "'Storage full' messages even after uninstalling apps",
          "Very slow menus, apps freezing or crashing",
          "Google account or Play Store errors",
          "Wi-Fi or Bluetooth remote disconnecting",
          "Restarting repeatedly",
        ],
      },
      {
        heading: "Things you can safely try first",
        bullets: [
          "Unplug the TV from the wall for 2 minutes, then reconnect",
          "Clear the cache of the app that crashes (Settings > Apps)",
          "Check for a system update when the TV is working",
          "Avoid installing apps from unknown sources",
        ],
      },
      {
        heading: "Repairs we carry out",
        bullets: [
          "Firmware recovery using official update packages where supported",
          "Main board storage (eMMC) fault diagnosis and board repair or replacement",
          "Wi-Fi / Bluetooth module replacement",
          "Power, backlight and display repairs",
        ],
      },
    ],
    faqs: [
      {
        q: "My Android TV is stuck on the logo. Is it a software problem?",
        a: "It can be a corrupted update, but it is also a common symptom of failing internal storage or a power supply that drops out during start-up. Inspection tells us which.",
      },
      {
        q: "Do I lose my apps after repair?",
        a: "A firmware recovery or main board replacement resets the TV to factory settings, so you will need to sign in again. We let you know in advance.",
      },
    ],
    related: [
      "/tv-repair/smart-tv-repair",
      "/tv-problems/tv-restarting-problem",
      "/tv-problems/tv-wifi-problem",
      "/tv-brand-repair/mi-tv-repair",
    ],
    prefill: { equipment_type: "Android TV" },
  },
  {
    slug: "4k-tv-repair",
    title: "4K UHD TV Repair",
    label: "4K TV Repair",
    summary: "Repairs for 4K Ultra HD televisions - HDMI 2.0/2.1, HDR, boards and panels.",
    metaTitle: "4K TV Repair | UHD Display, HDMI & Board Faults",
    metaDescription:
      "4K Ultra HD TV repair for no picture, lines, HDMI handshake problems, HDR issues and board faults. Inspection and estimate from Veenus Electronics.",
    icon: "fourk",
    intro: [
      "4K (Ultra HD) refers to resolution, not a panel type - a 4K TV may be LED, QLED or OLED. Higher resolution panels use more complex timing boards and high-speed connections, which brings a few faults that are specific to 4K sets.",
    ],
    sections: [
      {
        heading: "4K-specific issues",
        bullets: [
          "Flashing or blank screen with 4K sources, consoles or streaming boxes",
          "HDMI 'no signal' with some devices but not others",
          "HDR content looking washed out or flickering",
          "Lines, ghosting or a half-screen picture",
        ],
      },
      {
        heading: "Before you book",
        bullets: [
          "Try a certified high-speed HDMI cable and a different HDMI port",
          "Check the TV's 'HDMI UHD Color' / 'Enhanced format' setting for that port",
          "Confirm the problem also happens with the TV's built-in apps",
        ],
      },
      {
        heading: "What we repair",
        bullets: [
          "HDMI port and main board faults",
          "T-con board and panel connection issues",
          "Power supply and backlight repairs",
        ],
      },
    ],
    faqs: [
      {
        q: "Why does my 4K TV go blank only with my set top box or console?",
        a: "This is often an HDMI handshake (HDCP) problem caused by the cable, port setting or source device rather than a TV fault. Try the checks above; if it persists, we can test the HDMI ports.",
      },
    ],
    related: ["/tv-problems/tv-hdmi-problem", "/tv-repair/led-tv-repair", "/tv-repair/oled-tv-repair"],
    prefill: { equipment_type: "Smart TV" },
  },
];

export const getTvService = (slug: string) => tvServices.find((s) => s.slug === slug);
