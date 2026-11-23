import type { LandingPage } from "./types";

export const electronics: LandingPage[] = [
  {
    slug: "home-theatre-repair",
    title: "Home Theatre Repair",
    label: "Home Theatre",
    summary: "Home theatre systems, soundbars and AV receivers - no sound, no power, distortion.",
    metaTitle: "Home Theatre & Soundbar Repair",
    metaDescription:
      "Home theatre, soundbar and AV receiver repair - no sound, no power, distortion, HDMI ARC and Bluetooth faults. Request an inspection from Veenus Electronics.",
    icon: "home",
    intro: [
      "Home theatre systems combine an amplifier, speakers and often HDMI and Bluetooth connectivity. We diagnose the whole chain so the actual fault is fixed, not just the symptom.",
    ],
    sections: [
      {
        heading: "Common issues",
        bullets: [
          "No power or switching off at high volume",
          "No sound from one or more speakers or the subwoofer",
          "Crackling, humming or distorted audio",
          "HDMI ARC / optical input not working with the TV",
          "Bluetooth not pairing",
          "Display or buttons not responding",
        ],
      },
      {
        heading: "Supported equipment",
        bullets: ["5.1 / 7.1 home theatre systems", "Soundbars and wireless subwoofers", "AV receivers", "DVD / Blu-ray home theatre units"],
      },
      {
        heading: "Before you bring it in",
        body: "If possible, bring the main unit along with the remote and power cable. For speaker-specific faults, bring the affected speaker as well.",
      },
    ],
    faqs: [
      {
        q: "My soundbar has no sound through HDMI ARC. Is it faulty?",
        a: "Check that HDMI-CEC/ARC is enabled on both the TV and the soundbar and that you are using the TV's ARC-labelled port. If it still fails, we can test the HDMI board.",
      },
    ],
    related: ["/electronics-repair/speaker-repair", "/electronics-repair/amplifier-repair", "/tv-problems/tv-hdmi-problem"],
    prefill: { equipment_type: "Home Theatre" },
  },
  {
    slug: "speaker-repair",
    title: "Speaker Repair",
    label: "Speakers",
    summary: "Passive and powered speakers, subwoofers and party speakers.",
    metaTitle: "Speaker & Subwoofer Repair",
    metaDescription:
      "Speaker and subwoofer repair - blown drivers, rattling, no sound, torn cones and powered-speaker amplifier faults. Request an inspection.",
    icon: "speaker",
    intro: [
      "Speakers fail mechanically (torn cones, damaged voice coils, perished foam surrounds) or electrically (crossover and built-in amplifier faults in powered speakers).",
    ],
    sections: [
      {
        heading: "Repair issues",
        bullets: [
          "No sound or very low output from one speaker",
          "Rattling, buzzing or scraping sounds",
          "Torn cone or crumbling foam surround",
          "Subwoofer not powering on",
          "Party speaker battery or Bluetooth faults",
        ],
      },
      {
        heading: "Supported equipment",
        bullets: ["Bookshelf and tower speakers", "Active / powered speakers", "Subwoofers", "Bluetooth and party speakers"],
      },
      {
        heading: "How we repair speakers",
        bullets: [
          "Test each driver (woofer, mid-range, tweeter) and the crossover separately",
          "Check powered speakers' built-in amplifier and power supply",
          "Recone, re-foam or replace drivers with suitably matched parts",
          "Play-test across the frequency range before return",
        ],
      },
    ],
    faqs: [
      {
        q: "Can a blown speaker be repaired?",
        a: "Often the driver can be reconed or replaced with a matched driver. We will advise whether repair or replacement is better for your speaker.",
      },
      {
        q: "Why does my speaker rattle at higher volume?",
        a: "Common causes are a perished foam surround, a loose dust cap, a rubbing voice coil or a loose cabinet part. Inspection identifies which, and most are repairable.",
      },
    ],
    related: ["/electronics-repair/amplifier-repair", "/electronics-repair/home-theatre-repair"],
    prefill: { equipment_type: "Speaker" },
  },
  {
    slug: "amplifier-repair",
    title: "Amplifier Repair",
    label: "Amplifiers",
    summary: "Stereo amplifiers, PA amplifiers and receivers - no output, hum, protection mode.",
    metaTitle: "Amplifier Repair | Stereo, PA & Receiver",
    metaDescription:
      "Amplifier repair for no output, humming, distortion, protection mode and channel failure on stereo, PA and receiver units. Contact Veenus Electronics.",
    icon: "amp",
    intro: [
      "Amplifiers handle high power and heat. Output transistors, power supplies and protection relays are the usual points of failure.",
    ],
    sections: [
      {
        heading: "Repair issues",
        bullets: [
          "Amplifier goes into protection mode",
          "One channel dead or weak",
          "Humming or buzzing",
          "Distortion at moderate volume",
          "Volume knob crackling",
          "Blown fuse or no power",
        ],
      },
      {
        heading: "Supported equipment",
        bullets: ["Stereo integrated amplifiers", "AV receivers", "PA and DJ amplifiers", "Car audio amplifiers (bench repair)"],
      },
      {
        heading: "How we repair amplifiers",
        bullets: [
          "Bench-test with dummy loads so your speakers are never at risk",
          "Check the power supply, output stage, protection relay and bias settings",
          "Replace failed transistors, capacitors and relays with suitable parts",
          "Clean noisy controls and soak-test at working volume before return",
        ],
      },
    ],
    faqs: [
      {
        q: "Why does my amplifier keep going into protection?",
        a: "Common causes are a shorted speaker cable, a failed output stage or a DC offset fault. Disconnect the speakers and try again - if it still trips, it needs inspection.",
      },
      {
        q: "Is it safe to keep using an amplifier that hums?",
        a: "A light hum can be an earthing or cable issue, but a hum that grows louder, a burning smell or one dead channel can mean a failing power supply or output stage. Switch it off and have it checked to avoid damaging your speakers.",
      },
    ],
    related: ["/electronics-repair/speaker-repair", "/electronics-repair/home-theatre-repair"],
    prefill: { equipment_type: "Amplifier" },
  },
  {
    slug: "projector-repair",
    title: "Projector Repair",
    label: "Projectors",
    summary: "Home and office projectors - lamp, colour, overheating and power faults.",
    metaTitle: "Projector Repair | Home & Office Projectors",
    metaDescription:
      "Projector repair for no power, overheating, colour problems, dim picture, lamp and fan faults. Request an inspection from Veenus Electronics.",
    icon: "projector",
    intro: [
      "Projectors combine optics, a light source and cooling. Dust build-up is a frequent cause of overheating, dim images and shutdowns.",
    ],
    sections: [
      {
        heading: "Repair issues",
        bullets: [
          "Projector shuts down after a few minutes (overheating)",
          "Lamp or temperature warning light",
          "Dim, blotchy or yellowish image",
          "Coloured dots or lines",
          "No power or fan noise",
        ],
      },
      {
        heading: "Supported equipment",
        bullets: ["Home cinema projectors", "Office / education projectors", "Portable LED projectors"],
      },
      {
        heading: "How we repair projectors",
        bullets: [
          "Clean the cooling path, filters and fans - a common cause of shutdowns",
          "Test the lamp or LED light source and its driver",
          "Inspect the optical path for dust spots and colour problems",
          "Check the power supply and main board, then run a long test",
        ],
      },
    ],
    faqs: [
      {
        q: "My projector's image is dim. Do I need a new lamp?",
        a: "Possibly, but dirty optics, a clogged filter or a failing colour wheel can also cause a dim image. Inspection confirms the cause before you buy a lamp.",
      },
      {
        q: "Why does my projector switch off after a few minutes?",
        a: "Usually overheating caused by blocked filters, a dusty cooling path or a failing fan. Cleaning and replacing the fan normally solves it; continuing to use an overheating projector can damage the light source.",
      },
    ],
    related: ["/electronics-repair/home-theatre-repair", "/tv-repair/4k-tv-repair"],
    prefill: { equipment_type: "Projector" },
  },
  {
    slug: "dvd-player-repair",
    title: "DVD & Blu-ray Player Repair",
    label: "DVD Players",
    summary: "DVD and Blu-ray players - disc reading, tray and power faults.",
    metaTitle: "DVD & Blu-ray Player Repair",
    metaDescription:
      "DVD and Blu-ray player repair - not reading discs, tray stuck, no power and no output. Contact Veenus Electronics for an inspection.",
    icon: "disc",
    intro: [
      "Disc players most commonly fail at the optical laser pickup or the tray mechanism. Repair viability depends on the availability of parts for your model.",
    ],
    sections: [
      {
        heading: "Repair issues",
        bullets: ["'No disc' or 'disc error' messages", "Tray not opening or closing", "Skipping or freezing playback", "No power", "No video or audio output"],
      },
      {
        heading: "Supported equipment",
        bullets: ["DVD players", "Blu-ray players", "DVD home theatre main units"],
      },
      {
        heading: "How we repair disc players",
        bullets: [
          "Clean the laser lens and check the disc-reading mechanism",
          "Replace worn tray belts and gears",
          "Test the power supply and audio/video outputs",
          "Confirm laser pickup availability before replacing it",
        ],
      },
    ],
    faqs: [
      {
        q: "Is it worth repairing a DVD player?",
        a: "For a simple belt or tray fault, usually yes. If the laser pickup is unavailable or expensive, replacement may be better - we will advise honestly.",
      },
      {
        q: "My DVD player says 'No Disc'. Is the laser dead?",
        a: "Not always. A dirty lens, a worn belt or a sticking mechanism can cause the same message. We check those first because they are cheaper to fix than a laser replacement.",
      },
    ],
    related: ["/electronics-repair/home-theatre-repair", "/electronics-repair/set-top-box-repair"],
    prefill: { equipment_type: "DVD Player" },
  },
  {
    slug: "set-top-box-repair",
    title: "Set Top Box Repair",
    label: "Set Top Boxes",
    summary: "DTH and cable set top boxes - power, signal and output faults.",
    metaTitle: "Set Top Box Repair | DTH & Cable Boxes",
    metaDescription:
      "Set top box repair for no power, no signal, frozen screens, remote and HDMI faults on purchased DTH and cable boxes. Request an inspection.",
    icon: "box",
    intro: [
      "Set top boxes run continuously and are sensitive to power surges. Power adaptor and power-board failures are among the most common faults.",
      "Note: If your box is rented from or still covered by your DTH/cable operator, contact the operator first - they may replace it free of charge.",
    ],
    sections: [
      {
        heading: "Repair issues",
        bullets: ["No power / no front-panel light", "Restarting repeatedly", "'No signal' when the dish and cable are fine", "No HDMI output", "Remote not responding"],
      },
      {
        heading: "Supported equipment",
        bullets: ["DTH set top boxes (owned)", "Cable set top boxes (owned)", "Android-based streaming boxes"],
      },
      {
        heading: "How we repair set top boxes",
        bullets: [
          "Test the power adaptor and internal power supply first - the most common failure",
          "Check the tuner input, HDMI output and front-panel controls",
          "Replace failed components after surge damage",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you fix signal problems with my dish?",
        a: "Our repair covers the set top box itself. Dish alignment and subscription issues are handled by your DTH operator.",
      },
    ],
    related: ["/tv-problems/tv-hdmi-problem", "/electronics-repair/dvd-player-repair"],
    prefill: { equipment_type: "Set Top Box" },
  },
];

export const getElectronicsService = (slug: string) => electronics.find((e) => e.slug === slug);
