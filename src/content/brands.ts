import type { LandingPage } from "./types";

/**
 * Brand landing pages.
 * Veenus Electronics is an independent repairer. Pages must never imply
 * manufacturer authorisation or official service-centre status. A standard
 * disclaimer is rendered on every brand page (see BrandDisclaimer).
 * Remove any brand the business does not actually service.
 */
export const brands: (LandingPage & { brand: string })[] = [
  {
    slug: "samsung-tv-repair",
    brand: "Samsung",
    title: "Samsung TV Repair",
    label: "Samsung",
    summary: "LED, QLED, Crystal UHD and smart TV repairs for Samsung televisions.",
    metaTitle: "Samsung TV Repair | LED, QLED & Smart TV",
    metaDescription:
      "Independent Samsung TV repair for LED, QLED and Crystal UHD models - backlight, no power, Tizen boot problems, lines and boards. Request an inspection.",
    icon: "tv",
    intro: [
      "Samsung televisions in India span basic HD LED sets, Crystal UHD 4K models, QLED and Neo QLED (mini-LED) ranges. Smart models run Samsung's Tizen operating system.",
      "We repair Samsung TVs independently once their manufacturer warranty has ended. If your TV is still under warranty, contact Samsung first - opening it elsewhere may affect that warranty.",
    ],
    sections: [
      {
        heading: "Samsung TV types we work on",
        bullets: ["HD and Full HD LED TVs", "Crystal UHD 4K TVs", "QLED and Neo QLED TVs", "Tizen smart TVs", "Models with an external One Connect box"],
      },
      {
        heading: "Problems we commonly see on Samsung TVs",
        bullets: [
          "Sound but no picture caused by LED backlight failure",
          "Red standby light blinking with no start-up",
          "Stuck on the Samsung logo or restarting (Tizen boot issues)",
          "Uneven brightness or blooming on QLED models",
          "One Connect box or cable faults on supported models",
          "Wi-Fi option missing or apps failing to load",
        ],
      },
      {
        heading: "Helpful information to share",
        body: "The model code on the rear sticker (for example starting with 'UA' or 'QA' on Indian models) tells us the exact series and panel. Please add it to your enquiry along with a photo of the problem if you can.",
      },
    ],
    faqs: [
      {
        q: "Are you an authorised Samsung service centre?",
        a: "No. Veenus Electronics is an independent repair service. We are not affiliated with or authorised by Samsung.",
      },
      {
        q: "Where do I find my Samsung TV model number?",
        a: "On the sticker on the back of the TV, or in Settings > Support > About This TV on smart models.",
      },
    ],
    related: ["/tv-repair/qled-tv-repair", "/tv-problems/tv-backlight-repair", "/tv-repair/smart-tv-repair"],
    prefill: { brand: "Samsung" },
  },
  {
    slug: "lg-tv-repair",
    brand: "LG",
    title: "LG TV Repair",
    label: "LG",
    summary: "LED, NanoCell, OLED and webOS smart TV repairs for LG televisions.",
    metaTitle: "LG TV Repair | LED, NanoCell, OLED & webOS",
    metaDescription:
      "Independent LG TV repair for LED, NanoCell, QNED and OLED models - backlight, no power, webOS problems, lines and board faults. Book an inspection.",
    icon: "tv",
    intro: [
      "LG offers LED, NanoCell, QNED and OLED televisions. Smart models run LG's webOS platform and are controlled with the Magic Remote on many models.",
      "Because LG is a major OLED manufacturer, we see a good number of LG OLED sets - which need careful, panel-safe handling.",
    ],
    sections: [
      {
        heading: "LG TV types we work on",
        bullets: ["LED and UHD TVs", "NanoCell and QNED TVs", "OLED TVs", "webOS smart TVs"],
      },
      {
        heading: "Problems we commonly see on LG TVs",
        bullets: [
          "Dark screen with sound on LED models (backlight)",
          "OLED lines, flicker or power cycling",
          "webOS stuck on logo or very slow",
          "Magic Remote pairing problems",
          "No power after voltage fluctuations",
        ],
      },
      {
        heading: "OLED care",
        body: "If you own an LG OLED, avoid static logos at high brightness for long periods and allow the TV's automatic pixel refresh to run when it is switched to standby. Unplugging immediately after use can prevent this maintenance cycle.",
      },
    ],
    faqs: [
      {
        q: "Are you an authorised LG service centre?",
        a: "No. We are an independent repair service and are not affiliated with or authorised by LG.",
      },
    ],
    related: ["/tv-repair/oled-tv-repair", "/tv-repair/led-tv-repair", "/tv-problems/tv-screen-lines"],
    prefill: { brand: "LG" },
  },
  {
    slug: "sony-tv-repair",
    brand: "Sony",
    title: "Sony TV Repair",
    label: "Sony",
    summary: "Sony Bravia LED, OLED and Google TV / Android TV repairs.",
    metaTitle: "Sony TV Repair | Bravia LED, OLED & Google TV",
    metaDescription:
      "Independent Sony Bravia TV repair - red light blinking, no picture, Android/Google TV boot loops, backlight and board faults. Request an inspection.",
    icon: "tv",
    intro: [
      "Sony Bravia televisions include LED, full-array, mini-LED and OLED models. Recent smart models run Google TV, and earlier ones run Android TV.",
      "Sony TVs often report faults through a blinking red standby light - counting the blinks gives a useful starting point for diagnosis.",
    ],
    sections: [
      {
        heading: "Sony TV types we work on",
        bullets: ["Bravia LED TVs", "Bravia OLED TVs", "Android TV and Google TV models"],
      },
      {
        heading: "Problems we commonly see on Sony TVs",
        bullets: [
          "Red light blinking a set number of times",
          "Stuck on the Sony or Android logo",
          "Sound but no picture",
          "Remote not responding / voice search not working",
          "HDMI or eARC problems with soundbars",
        ],
      },
      {
        heading: "Tip: count the blinks",
        body: "When the red light blinks, count the number of blinks before it pauses and repeats. Include that number in your enquiry - it helps narrow down which board to check.",
      },
    ],
    faqs: [
      {
        q: "Are you an authorised Sony service centre?",
        a: "No. Veenus Electronics is independent and is not affiliated with or authorised by Sony.",
      },
    ],
    related: ["/tv-repair/android-tv-repair", "/tv-problems/tv-not-turning-on", "/tv-repair/oled-tv-repair"],
    prefill: { brand: "Sony" },
  },
  {
    slug: "mi-tv-repair",
    brand: "Xiaomi",
    title: "Mi / Xiaomi TV Repair",
    label: "Xiaomi (Mi)",
    summary: "Xiaomi, Mi and Redmi smart TV repairs - backlight, boot loop, boards.",
    metaTitle: "Mi TV Repair | Xiaomi & Redmi Smart TV Repair",
    metaDescription:
      "Independent Mi / Xiaomi / Redmi TV repair - backlight failure, stuck on logo, PatchWall and Google TV problems, no power and board faults.",
    icon: "android",
    intro: [
      "Xiaomi sells TVs in India under the Mi, Xiaomi and Redmi names. Most are Android TV or Google TV models, many with Xiaomi's PatchWall interface on top.",
    ],
    sections: [
      {
        heading: "Mi TV models we work on",
        bullets: ["Mi TV and Mi TV 4A/4X series", "Xiaomi smart TV X and A series", "Redmi smart TVs", "Android TV and Google TV models"],
      },
      {
        heading: "Problems we commonly see on Mi TVs",
        bullets: [
          "Backlight failure - screen dark with sound",
          "Stuck on the Mi logo or boot animation",
          "Storage full / slow performance",
          "Bluetooth remote disconnecting",
          "No power after a surge",
        ],
      },
    ],
    faqs: [
      {
        q: "Are you an authorised Xiaomi service centre?",
        a: "No. We are an independent repair service, not affiliated with or authorised by Xiaomi.",
      },
      {
        q: "My Mi TV remote stopped working. Is it the TV?",
        a: "Try re-pairing the Bluetooth remote by holding the Home and Menu buttons near the TV, and replace batteries. If the IR sensor or Bluetooth module has failed, we can check it.",
      },
    ],
    related: ["/tv-repair/android-tv-repair", "/tv-problems/tv-backlight-repair", "/tv-problems/tv-restarting-problem"],
    prefill: { brand: "Xiaomi" },
  },
  {
    slug: "oneplus-tv-repair",
    brand: "OnePlus",
    title: "OnePlus TV Repair",
    label: "OnePlus",
    summary: "OnePlus Y, U and Q series smart TV repairs.",
    metaTitle: "OnePlus TV Repair | Y, U & Q Series Smart TV",
    metaDescription:
      "Independent OnePlus TV repair - no picture, backlight, Android TV boot problems, Wi-Fi and board faults on Y, U and Q series models.",
    icon: "android",
    intro: [
      "OnePlus televisions in India include the Y series, U series and Q series, running Android TV or Google TV with OnePlus's own Oxygen Play features.",
    ],
    sections: [
      {
        heading: "OnePlus TV types we work on",
        bullets: ["Y series HD/FHD/UHD TVs", "U series 4K TVs", "Q series QLED TVs"],
      },
      {
        heading: "Problems we commonly see",
        bullets: [
          "Sound but no picture",
          "Restarting or stuck on the OnePlus logo",
          "Wi-Fi dropping or not detected",
          "Lines on the display",
          "No power",
        ],
      },
      {
        heading: "Before you book: quick checks for OnePlus TVs",
        bullets: [
          "Unplug the TV at the wall for two minutes - this clears many Android TV freezes and boot loops",
          "Check for a system update in Settings once the TV starts normally",
          "If only some apps fail, clear that app's cache in Settings > Apps before assuming a hardware fault",
          "Note the model number from Settings > Device Preferences > About, or from the rear label",
        ],
      },
      {
        heading: "Which faults usually need a technician",
        body: "A dark screen with working sound, a TV that will not power on at all, lines across the picture, or a TV that restarts before reaching the home screen point to backlight, power or board faults. These need the back cover removed and should be handled by a trained technician.",
      },
    ],
    faqs: [
      {
        q: "Are you an authorised OnePlus service centre?",
        a: "No. Veenus Electronics is an independent repairer and is not affiliated with or authorised by OnePlus.",
      },
      {
        q: "My OnePlus TV is stuck on the logo. Will a factory reset help?",
        a: "If the TV reaches the recovery or settings menu, a factory reset can fix software corruption, but it erases your apps and logins. If it never gets past the logo, the cause is more likely the main board storage or power supply, which needs inspection.",
      },
    ],
    related: ["/tv-repair/android-tv-repair", "/tv-problems/tv-sound-but-no-picture", "/tv-problems/tv-wifi-problem"],
    prefill: { brand: "OnePlus" },
  },
  {
    slug: "tcl-tv-repair",
    brand: "TCL",
    title: "TCL TV Repair",
    label: "TCL",
    summary: "TCL LED, QLED, mini-LED and Google TV repairs.",
    metaTitle: "TCL TV Repair | LED, QLED & Google TV",
    metaDescription:
      "Independent TCL TV repair - backlight failure, no power, Google TV / Android TV problems, lines and board faults on LED, QLED and mini-LED models.",
    icon: "tv",
    intro: [
      "TCL makes a wide range of LED, QLED and mini-LED televisions, most running Google TV or Android TV. TCL also manufactures its own panels.",
    ],
    sections: [
      {
        heading: "TCL TV types we work on",
        bullets: ["LED HD/FHD/4K TVs", "QLED TVs", "Mini-LED TVs", "Google TV and Android TV models"],
      },
      {
        heading: "Problems we commonly see",
        bullets: ["Backlight failure", "Stuck on logo / boot loop", "No power or blinking standby light", "Patchy brightness on QLED models"],
      },
      {
        heading: "Before you book: quick checks for TCL TVs",
        bullets: [
          "Unplug at the wall for two minutes to clear a frozen Google TV or Android TV start-up",
          "Try the power button on the TV itself in case the remote or its batteries are the problem",
          "On Google TV models, check Settings > System > About for the model number and software version",
          "If the screen is dark, try the torch test: shine a phone torch close to the screen and look for a faint picture",
        ],
      },
      {
        heading: "Mini-LED and QLED models",
        body: "TCL's mini-LED and QLED televisions use many more LEDs and dimming zones than basic LED sets. Faults such as patches that stay bright or dark usually involve the backlight array or its driver, and the panel must be opened in a clean workshop to repair them without leaving dust behind the screen.",
      },
    ],
    faqs: [
      {
        q: "Are you an authorised TCL service centre?",
        a: "No. We are independent and not affiliated with or authorised by TCL.",
      },
      {
        q: "My TCL TV has sound but no picture. What is the likely cause?",
        a: "On LED and QLED TCL models the most common cause is failed LED backlight strips. If a torch held close to the screen shows a faint picture, the backlight is very likely at fault and is usually repairable.",
      },
    ],
    related: ["/tv-repair/qled-tv-repair", "/tv-problems/tv-backlight-repair", "/tv-repair/android-tv-repair"],
    prefill: { brand: "TCL" },
  },
  {
    slug: "hisense-tv-repair",
    brand: "Hisense",
    title: "Hisense TV Repair",
    label: "Hisense",
    summary: "Hisense LED, ULED and smart TV repairs (VIDAA and Google TV models).",
    metaTitle: "Hisense TV Repair | LED, ULED & Smart TV",
    metaDescription:
      "Independent Hisense TV repair - backlight, no power, VIDAA and Google TV problems, display lines and board faults. Book an inspection.",
    icon: "tv",
    intro: [
      "Hisense televisions include LED and ULED ranges. Depending on the model, they run Hisense's VIDAA platform or Google TV / Android TV.",
    ],
    sections: [
      {
        heading: "Hisense TV types we work on",
        bullets: ["LED HD/FHD/4K TVs", "ULED TVs", "VIDAA smart TVs", "Google TV / Android TV models"],
      },
      {
        heading: "Problems we commonly see",
        bullets: ["Dark screen with sound", "Restarting or stuck on logo", "No power", "Apps not loading or Wi-Fi faults"],
      },
      {
        heading: "Before you book: quick checks for Hisense TVs",
        bullets: [
          "Unplug at the wall for two minutes - many software freezes clear after a full power cycle",
          "Find the model number on the rear label or in the support / system information section of the settings menu",
          "Check whether the fault happens on every input or only one HDMI device",
          "Note whether the standby light blinks, and how many times - it helps narrow down the fault",
        ],
      },
      {
        heading: "VIDAA and Google TV models",
        body: "Hisense uses its own VIDAA platform on some models and Google TV or Android TV on others. Software problems are handled differently on each, so tell us which one your TV runs (it is shown on the home screen) when you book.",
      },
    ],
    faqs: [
      {
        q: "Are you an authorised Hisense service centre?",
        a: "No. Veenus Electronics is an independent repairer, not affiliated with or authorised by Hisense.",
      },
      {
        q: "Can a Hisense TV with lines on the screen be repaired?",
        a: "Lines caused by the timing (T-con) board or a loose panel cable are often repairable. Lines caused by damage inside the panel usually need a panel replacement, which may not be economical. A photo of the lines helps us advise before inspection.",
      },
    ],
    related: ["/tv-repair/smart-tv-repair", "/tv-problems/tv-black-screen", "/tv-problems/tv-backlight-repair"],
    prefill: { brand: "Hisense" },
  },
  {
    slug: "panasonic-tv-repair",
    brand: "Panasonic",
    title: "Panasonic TV Repair",
    label: "Panasonic",
    summary: "Panasonic LED and smart TV repairs, including older models.",
    metaTitle: "Panasonic TV Repair | LED & Smart TV",
    metaDescription:
      "Independent Panasonic TV repair for LED and smart TVs - no power, blinking light, backlight and board faults, including older models.",
    icon: "tv",
    intro: [
      "Panasonic TVs are known for long service lives, which means we often see older models that owners want to keep running. Parts availability is the main factor in repairing these sets.",
    ],
    sections: [
      {
        heading: "Panasonic TV types we work on",
        bullets: ["LED HD/FHD/4K TVs", "Smart TVs including Android TV models", "Older LCD models (subject to parts)"],
      },
      {
        heading: "Problems we commonly see",
        bullets: ["Red light blinking with no picture", "No power", "Backlight failure", "No signal on inputs"],
      },
      {
        heading: "Keeping an older Panasonic TV running",
        bullets: [
          "Power supply capacitors are a common age-related failure and are usually repairable",
          "Backlight strips in older LED models can be replaced if matching parts are available",
          "We check parts availability for your exact model before you approve any work",
          "If parts are no longer made, we tell you honestly rather than fitting an unsuitable substitute",
        ],
      },
      {
        heading: "Blinking red light",
        body: "Many Panasonic TVs signal a fault by blinking the red standby light a set number of times. Count the blinks before the pattern repeats and include the number in your enquiry - it points us towards the power, backlight or main board section.",
      },
    ],
    faqs: [
      {
        q: "Are you an authorised Panasonic service centre?",
        a: "No. We are independent and not affiliated with or authorised by Panasonic.",
      },
      {
        q: "Is it worth repairing an older Panasonic TV?",
        a: "Often yes, for power supply and backlight faults, as long as parts are available. If the panel itself has failed or parts are no longer made, a replacement TV may be better value - we will tell you before any work starts.",
      },
    ],
    related: ["/tv-repair/lcd-tv-repair", "/tv-problems/tv-not-turning-on", "/tv-repair/led-tv-repair"],
    prefill: { brand: "Panasonic" },
  },
  {
    slug: "haier-tv-repair",
    brand: "Haier",
    title: "Haier TV Repair",
    label: "Haier",
    summary: "Haier LED and Android / Google TV repairs.",
    metaTitle: "Haier TV Repair | LED & Smart TV",
    metaDescription:
      "Independent Haier TV repair - backlight failure, no power, Android TV and Google TV problems and board faults. Request an inspection.",
    icon: "tv",
    intro: ["Haier offers LED and smart TVs in India, with many smart models running Android TV or Google TV."],
    sections: [
      {
        heading: "Haier TV types we work on",
        bullets: ["LED HD/FHD/4K TVs", "Android TV and Google TV models"],
      },
      {
        heading: "Problems we commonly see",
        bullets: ["Sound but no picture", "No power after surge", "Boot loop or slow performance", "Remote and Wi-Fi faults"],
      },
      {
        heading: "Before you book: quick checks for Haier TVs",
        bullets: [
          "Unplug the TV at the wall for two minutes, then switch on again",
          "Replace the remote batteries and try the TV's own power button",
          "On Android TV and Google TV models, check Settings for a system update once the TV starts",
          "Note the model number from the rear label or the About section in Settings",
        ],
      },
      {
        heading: "Faults that need a technician",
        body: "A dark screen with working sound usually means failed LED backlight strips. No power after a storm or voltage fluctuation usually means the power supply board. Both need the TV opened, which should only be done by a trained technician because the power board can hold a dangerous charge.",
      },
    ],
    faqs: [
      {
        q: "Are you an authorised Haier service centre?",
        a: "No. Veenus Electronics is an independent repairer, not affiliated with or authorised by Haier.",
      },
      {
        q: "My Haier TV stopped working after a power cut. Can it be fixed?",
        a: "Usually yes. Voltage surges most often damage the power supply board, which can be repaired or replaced. A surge protector or stabiliser helps prevent it happening again.",
      },
    ],
    related: ["/tv-repair/android-tv-repair", "/tv-problems/tv-sound-but-no-picture", "/tv-problems/tv-power-supply-repair"],
    prefill: { brand: "Haier" },
  },
];

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
