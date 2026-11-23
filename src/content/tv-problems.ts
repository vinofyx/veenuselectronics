import type { LandingPage } from "./types";

/**
 * TV problem landing pages. Every page also renders a standard safety notice
 * (see components/SafetyNotice) warning against opening the TV.
 */
export const tvProblems: LandingPage[] = [
  {
    slug: "tv-not-turning-on",
    title: "TV Not Turning On",
    label: "TV Not Turning ON",
    summary: "No power, no standby light, or a light that blinks but the TV never starts.",
    metaTitle: "TV Not Turning On? Causes & Professional Repair",
    metaDescription:
      "TV won't turn on, standby light blinking or no light at all? Learn the likely causes, safe checks to try, and how Veenus Electronics repairs it.",
    icon: "power",
    intro: [
      "A TV that will not switch on is one of the most common repair requests. The cause can be as simple as a faulty socket or remote, or as involved as a failed power supply or main board.",
    ],
    sections: [
      {
        heading: "Symptoms",
        bullets: [
          "No standby light at all",
          "Standby light on, but nothing happens when you press power",
          "Standby light blinks a set number of times (often an error code)",
          "Clicking sound, or the TV turns on for a second and goes off",
        ],
      },
      {
        heading: "Safe checks you can do first",
        bullets: [
          "Plug the TV directly into a wall socket you know works - not a spike guard or stabiliser",
          "Try the power button on the TV itself, not only the remote",
          "Replace the remote batteries",
          "Unplug for 2 minutes, then reconnect (this resets the standby circuit)",
        ],
      },
      {
        heading: "Possible causes",
        bullets: [
          "Power supply board failure (swollen capacitors, failed fuse or regulator)",
          "Main board not starting, sometimes due to firmware corruption",
          "Voltage surge or lightning damage",
          "Faulty button panel or IR remote sensor",
          "Backlight short circuit that triggers the protection mode",
        ],
      },
      {
        heading: "How a technician diagnoses it",
        body: "We measure the standby and main voltages from the power board, check whether the main board responds, and read any blink-code pattern against the manufacturer's service information. This isolates the failed section rather than guessing.",
      },
      {
        heading: "Possible repair options",
        bullets: [
          "Component-level power supply repair, or replacement of the power board",
          "Main board repair, firmware recovery or replacement",
          "Backlight repair if it is triggering protection shutdown",
          "Button panel or IR sensor replacement",
        ],
      },
    ],
    faqs: [
      {
        q: "My TV's red light is blinking. What does it mean?",
        a: "Many brands use the number of blinks as an error code - for example pointing to the power supply, backlight or main board. Count the blinks and mention it in your enquiry; it helps us prepare.",
      },
      {
        q: "Can a voltage fluctuation stop my TV from turning on?",
        a: "Yes. Surges commonly damage the power supply board. A good surge protector or stabiliser rated for TVs reduces the risk in future.",
      },
    ],
    related: ["/tv-problems/tv-power-supply-repair", "/tv-problems/tv-motherboard-repair", "/tv-repair/led-tv-repair"],
    prefill: { problem: "Not Turning ON" },
  },
  {
    slug: "tv-sound-but-no-picture",
    title: "TV Has Sound But No Picture",
    label: "Sound But No Picture",
    summary: "Audio works normally but the screen is dark or completely black.",
    metaTitle: "TV Sound But No Picture? Backlight & Display Repair",
    metaDescription:
      "Your TV has sound but no picture? This is usually a backlight or display fault. Learn the torch test, possible causes and how Veenus Electronics repairs it.",
    icon: "volume",
    intro: [
      "When you can hear the TV but the screen stays black, the TV's main electronics are working. The fault is usually in the parts that light or drive the screen - very often the LED backlight.",
    ],
    sections: [
      {
        heading: "The torch test",
        body: "Turn the TV on, darken the room and shine a phone torch close to the screen at an angle. If you can faintly see menus or the picture, the panel is producing an image and the backlight has failed. If the screen is completely blank even with a torch, the fault is more likely the T-con board, panel connection or main board.",
      },
      {
        heading: "Possible causes",
        bullets: [
          "Failed LED backlight strips (most common on LED and QLED TVs)",
          "Faulty LED driver circuit on the power board",
          "T-con board or panel ribbon cable fault",
          "Main board not sending a video signal",
          "Incorrect input or picture setting (check input source first)",
        ],
      },
      {
        heading: "Professional diagnosis",
        body: "We test the backlight voltage and individual LEDs, check the T-con supply, and confirm the main board's video output. This tells us whether a backlight, board or panel repair is needed.",
      },
      {
        heading: "Possible repair options",
        bullets: [
          "Replacement of the complete LED backlight strip set (replacing only one strip often leads to early failure of the rest)",
          "LED driver or power board repair",
          "T-con board or cable replacement",
          "Main board repair or replacement",
        ],
      },
    ],
    faqs: [
      {
        q: "Should all backlight strips be replaced or just the faulty one?",
        a: "LEDs in a TV age together. Replacing only the failed strip is cheaper today but the remaining strips frequently fail soon after. We will explain both options and the trade-off.",
      },
    ],
    related: ["/tv-problems/tv-backlight-repair", "/tv-problems/tv-black-screen", "/tv-repair/led-tv-repair"],
    prefill: { problem: "Sound But No Picture" },
  },
  {
    slug: "tv-black-screen",
    title: "TV Black Screen Repair",
    label: "TV Black Screen",
    summary: "Screen stays black - with or without sound, standby light or menus.",
    metaTitle: "TV Black Screen Repair | Causes & Diagnosis",
    metaDescription:
      "TV screen black? Find out whether it's the backlight, board, power or a settings issue, the checks you can try safely, and how Veenus Electronics fixes it.",
    icon: "screenOff",
    intro: [
      "'Black screen' can mean several different faults. The key clue is what else the TV is doing: Is there sound? Does the standby light change? Does the remote's volume bar appear?",
    ],
    sections: [
      {
        heading: "Work out which type of black screen you have",
        bullets: [
          "Black screen with sound - usually backlight (see sound-but-no-picture)",
          "Black screen, no sound, standby light on - power supply or main board",
          "Black screen only on one input - source device, cable or HDMI port",
          "Picture appears briefly then goes black - protection shutdown or backlight",
        ],
      },
      {
        heading: "Quick checks",
        bullets: [
          "Press the Home or Menu button - if the menu appears, the TV is fine and the input/source is the problem",
          "Check whether a power-saving or 'screen off' mode is enabled",
          "Try another HDMI cable or input",
        ],
      },
      {
        heading: "Possible causes",
        bullets: [
          "LED backlight failure",
          "Power supply output failure",
          "Main board or firmware fault",
          "T-con or panel failure",
        ],
      },
      {
        heading: "Repair options",
        body: "Depending on the diagnosis, we repair or replace the backlight, power board, main board or T-con board. Panel replacement is only recommended when the panel itself has failed and it is economical.",
      },
    ],
    faqs: [
      {
        q: "Is a black screen always expensive to fix?",
        a: "No. Backlight and power board repairs are usually much cheaper than a new TV. Panel failure is the expensive case, and we will tell you if that applies before any work.",
      },
    ],
    related: ["/tv-problems/tv-sound-but-no-picture", "/tv-problems/tv-not-turning-on", "/tv-problems/tv-backlight-repair"],
    prefill: { problem: "Black Screen" },
  },
  {
    slug: "tv-screen-lines",
    title: "TV Screen Lines Repair",
    label: "TV Display Lines",
    summary: "Vertical or horizontal lines, bands of colour, or a split / doubled picture.",
    metaTitle: "Lines on TV Screen? Vertical & Horizontal Line Repair",
    metaDescription:
      "Vertical or horizontal lines on your TV screen? Learn the difference between board and panel faults and how Veenus Electronics diagnoses display line problems.",
    icon: "lines",
    intro: [
      "Lines on the screen can come from the panel, the panel's connections or the timing (T-con) board that drives it. Some are repairable at reasonable cost; others point to panel damage.",
    ],
    sections: [
      {
        heading: "Symptoms",
        bullets: [
          "One or more thin vertical lines in a fixed position",
          "Thick coloured bands or a group of lines",
          "Horizontal lines or a flickering half-screen",
          "Picture doubled, split or ghosted",
        ],
      },
      {
        heading: "Useful clue: do the lines appear in the TV menu?",
        body: "If lines are visible on the TV's own menu or settings screen, the source device is not the cause. Take a photo and upload it with your enquiry - line patterns help us judge whether it is a board or panel issue.",
      },
      {
        heading: "Possible causes",
        bullets: [
          "T-con board failure",
          "Loose or damaged panel flex cable (COF) connections",
          "Panel source driver failure",
          "Physical pressure or impact damage to the panel",
          "Main board scaling/processing fault (less common)",
        ],
      },
      {
        heading: "Repair options",
        bullets: [
          "T-con board repair or replacement",
          "Cable reseating or replacement",
          "Panel replacement where economical",
        ],
      },
    ],
    faqs: [
      {
        q: "Can vertical lines on a TV be repaired?",
        a: "Lines caused by the T-con board or a cable are often repairable. Lines caused by a failed panel driver usually require a panel replacement, which may not be economical. A photo and inspection tell us which.",
      },
    ],
    related: ["/tv-repair/oled-tv-repair", "/tv-repair/4k-tv-repair", "/tv-problems/tv-motherboard-repair"],
    prefill: { problem: "Display Lines" },
  },
  {
    slug: "tv-backlight-repair",
    title: "TV Backlight Repair",
    label: "TV Backlight Problem",
    summary: "Dark, dim or patchy screen caused by failed LED backlight strips or drivers.",
    metaTitle: "TV Backlight Repair | LED Strip Replacement",
    metaDescription:
      "TV screen dark, dim or patchy? LED backlight repair and strip replacement for LED and QLED TVs. Inspection and transparent estimate from Veenus Electronics.",
    icon: "sun",
    intro: [
      "Backlight failure is the single most common fault on modern LED and QLED televisions. LEDs that run hot for years eventually fail, and because they are wired in series, one failed LED can darken a whole strip or the entire screen.",
    ],
    sections: [
      {
        heading: "Signs of backlight failure",
        bullets: [
          "Sound but no picture; picture visible with a torch",
          "Screen flashes on and then goes dark",
          "Dark patches, uneven brightness or one side darker",
          "Bright spots or a bluish tint in parts of the screen",
        ],
      },
      {
        heading: "Why backlights fail",
        bullets: [
          "Heat from high brightness settings over long periods",
          "Voltage fluctuations stressing the LED driver",
          "Ageing LEDs in a series string - one fails and the string goes dark",
        ],
      },
      {
        heading: "Our backlight repair process",
        bullets: [
          "Confirm the fault with a torch test and backlight voltage measurement",
          "Carefully open the TV and remove the panel in a dust-controlled area",
          "Test every strip and the LED driver circuit",
          "Replace strips with correctly matched parts and reassemble diffusers in the right order",
          "Burn-in test at operating brightness before return",
        ],
      },
      {
        heading: "Tips to extend backlight life",
        bullets: [
          "Lower backlight / brightness in the evening or use an eco mode",
          "Use a good-quality surge protector or stabiliser",
          "Keep ventilation slots clear and dust-free",
        ],
      },
    ],
    faqs: [
      {
        q: "Why is backlight repair a workshop job?",
        a: "The panel has to be separated from the frame and the diffuser sheets removed in a clean area. Dust or a mis-seated sheet causes spots and uneven brightness, so we normally do this at the workshop.",
      },
    ],
    related: ["/tv-problems/tv-sound-but-no-picture", "/tv-repair/led-tv-repair", "/tv-repair/qled-tv-repair"],
    prefill: { problem: "Backlight Problem" },
  },
  {
    slug: "tv-motherboard-repair",
    title: "TV Motherboard Repair",
    label: "TV Motherboard Problem",
    summary: "Main board faults - stuck logo, no inputs, no Wi-Fi, no sound or random behaviour.",
    metaTitle: "TV Motherboard Repair | Main Board Diagnosis",
    metaDescription:
      "TV main board (motherboard) repair for stuck logo, no input, no sound, Wi-Fi failure and restarting. Board-level diagnosis by Veenus Electronics.",
    icon: "cpu",
    intro: [
      "The main board (motherboard) is the TV's brain - it runs the software and processes picture and sound. When it fails, symptoms can look like many other faults, so accurate diagnosis matters.",
    ],
    sections: [
      {
        heading: "Symptoms of a main board fault",
        bullets: [
          "Stuck on the logo or restarting repeatedly",
          "No response to remote or buttons although power is present",
          "One or all HDMI inputs not working",
          "No sound with a normal picture",
          "Wi-Fi or Bluetooth option missing",
          "Picture freezes or colours are wrong on all inputs",
        ],
      },
      {
        heading: "Possible causes",
        bullets: [
          "Corrupted firmware or failing internal storage (eMMC)",
          "Surge damage via HDMI, antenna or power lines",
          "Failed voltage regulators on the board",
          "Overheating due to blocked ventilation",
        ],
      },
      {
        heading: "Repair options",
        bullets: [
          "Firmware recovery with official files where the model supports it",
          "Component-level repair of regulators and ports",
          "Main board replacement with a compatible board for your exact model",
        ],
      },
    ],
    faqs: [
      {
        q: "Does a replacement main board need to match exactly?",
        a: "Yes - the board must match your model and panel. Fitting an incorrect board can cause upside-down pictures, wrong colours or no picture. We match boards using the model number and panel code.",
      },
    ],
    related: ["/tv-problems/tv-restarting-problem", "/tv-problems/tv-hdmi-problem", "/tv-repair/smart-tv-repair"],
    prefill: { problem: "Motherboard Problem" },
  },
  {
    slug: "tv-power-supply-repair",
    title: "TV Power Supply Repair",
    label: "TV Power Supply Problem",
    summary: "Power board faults - no power, clicking, turning off, or surge damage.",
    metaTitle: "TV Power Supply Board Repair | No Power & Surge Damage",
    metaDescription:
      "TV power supply board repair for no power, clicking, switching off and surge damage. Safe, component-level diagnosis by Veenus Electronics.",
    icon: "plug",
    intro: [
      "The power supply board converts mains electricity into the voltages the TV needs. It works hard, gets warm, and is the first line of defence against voltage fluctuations - so it is a frequent point of failure.",
    ],
    sections: [
      {
        heading: "Symptoms",
        bullets: [
          "No standby light",
          "Clicking or ticking when switched on",
          "TV turns off by itself, especially when warm",
          "Burning smell or visible scorch marks (switch off and unplug immediately)",
        ],
      },
      {
        heading: "Possible causes",
        bullets: ["Swollen or dried-out capacitors", "Blown fuse after a surge", "Failed switching transistor or regulator", "Overheating"],
      },
      {
        heading: "Repair options",
        bullets: [
          "Component-level repair with quality-tested parts",
          "Power board replacement where repair is not reliable",
          "Advice on surge protection for your setup",
        ],
      },
    ],
    faqs: [
      {
        q: "Is it dangerous to open a TV power supply?",
        a: "Yes. Power supply capacitors can hold a dangerous charge even after the TV is unplugged. Please do not open it yourself - this is a job for a trained technician.",
      },
    ],
    related: ["/tv-problems/tv-not-turning-on", "/tv-problems/tv-backlight-repair", "/tv-repair/led-tv-repair"],
    prefill: { problem: "Power Supply Problem" },
  },
  {
    slug: "tv-hdmi-problem",
    title: "TV HDMI Problem Repair",
    label: "TV HDMI Problem",
    summary: "'No signal', flickering or no sound from HDMI devices, consoles or soundbars.",
    metaTitle: "TV HDMI Not Working? No Signal & HDMI Port Repair",
    metaDescription:
      "TV showing 'No Signal' on HDMI, flickering or ARC not working? Try these checks, then let Veenus Electronics test and repair your HDMI ports.",
    icon: "hdmi",
    intro: [
      "HDMI issues can be caused by the cable, the source device, a setting on the TV, or a physically damaged port. Most are easy to rule out at home before booking a repair.",
    ],
    sections: [
      {
        heading: "Symptoms",
        bullets: [
          "'No signal' on one or all HDMI inputs",
          "Picture flickers or drops out every few seconds",
          "No sound through a soundbar using HDMI ARC / eARC",
          "Loose port - picture appears only when the cable is held",
        ],
      },
      {
        heading: "Checks to try",
        bullets: [
          "Try a different HDMI cable and a different port",
          "Turn all devices off, unplug for a minute, then power on the TV first",
          "Enable HDMI-CEC / ARC settings for soundbars",
          "Disable 'enhanced' HDMI mode for older devices",
        ],
      },
      {
        heading: "Possible causes",
        bullets: ["Damaged or loose HDMI port", "Surge damage to the HDMI circuit", "Main board fault", "Firmware bug (an update may fix it)"],
      },
      {
        heading: "Repair options",
        bullets: ["HDMI port replacement", "Main board repair or replacement", "Firmware update where available"],
      },
    ],
    faqs: [
      {
        q: "Can a single HDMI port be replaced?",
        a: "Often yes, if the rest of the HDMI circuit is undamaged. If the port's controller chip is damaged, the main board may need repair or replacement.",
      },
    ],
    related: ["/tv-repair/4k-tv-repair", "/tv-problems/tv-motherboard-repair", "/electronics-repair/home-theatre-repair"],
    prefill: { problem: "Other" },
  },
  {
    slug: "tv-wifi-problem",
    title: "TV Wi-Fi Not Working",
    label: "TV WiFi Not Working",
    summary: "Smart TV not finding or not staying connected to Wi-Fi.",
    metaTitle: "Smart TV Wi-Fi Not Working? Causes & Repair",
    metaDescription:
      "Smart TV not connecting to Wi-Fi, Wi-Fi option greyed out or dropping frequently? Try these steps, then get the Wi-Fi module diagnosed by Veenus Electronics.",
    icon: "wifi",
    intro: [
      "When a smart TV cannot get online, every streaming app stops working. Many cases are router or setting related, but a failed Wi-Fi module is also common - especially after a power surge.",
    ],
    sections: [
      {
        heading: "Symptoms",
        bullets: [
          "Wi-Fi option greyed out or missing",
          "No networks found, while phones see the network",
          "Connects but drops frequently",
          "MAC address shows as all zeros or 'unavailable'",
        ],
      },
      {
        heading: "Checks to try first",
        bullets: [
          "Restart the router and unplug the TV for 2 minutes",
          "Move the router closer or check the 2.4 GHz band",
          "Forget the network on the TV and reconnect",
          "Install any pending software update (via a wired connection if possible)",
        ],
      },
      {
        heading: "Possible causes",
        bullets: ["Failed Wi-Fi module", "Loose module cable", "Firmware fault", "Main board fault"],
      },
      {
        heading: "Repair options",
        bullets: ["Wi-Fi / Bluetooth module replacement", "Cable reseating", "Firmware recovery", "Main board repair"],
      },
    ],
    faqs: [
      {
        q: "My TV's Wi-Fi is greyed out. Is it a hardware fault?",
        a: "Usually yes - a missing or greyed-out Wi-Fi option often means the TV cannot detect its Wi-Fi module, which points to the module, its cable or the main board.",
      },
    ],
    related: ["/tv-repair/smart-tv-repair", "/tv-repair/android-tv-repair", "/tv-problems/tv-motherboard-repair"],
    prefill: { problem: "WiFi Problem" },
  },
  {
    slug: "tv-restarting-problem",
    title: "TV Keeps Restarting",
    label: "TV Keeps Restarting",
    summary: "TV reboots on its own, loops at the logo, or turns off and on repeatedly.",
    metaTitle: "TV Keeps Restarting? Boot Loop Causes & Repair",
    metaDescription:
      "TV restarting by itself or stuck in a boot loop? Learn the common causes - firmware, storage, power - and how Veenus Electronics diagnoses and repairs it.",
    icon: "refresh",
    intro: [
      "A TV that restarts on its own is usually caught in one of two loops: software (it starts, crashes, restarts) or power (a protection circuit shuts it down when something draws too much current).",
    ],
    sections: [
      {
        heading: "Symptoms",
        bullets: [
          "Restarts while watching, especially in apps",
          "Shows the logo over and over (boot loop)",
          "Turns off and on every few minutes",
          "Restarts only when warm",
        ],
      },
      {
        heading: "Possible causes",
        bullets: [
          "Corrupted firmware or a failed update",
          "Worn internal storage on the main board",
          "Power supply instability",
          "Backlight short circuit triggering protection",
          "A faulty USB device or app",
        ],
      },
      {
        heading: "Safe things to try",
        bullets: [
          "Remove all USB devices and HDMI-CEC devices, then restart",
          "Unplug for 2 minutes",
          "If you can reach the menu, check for a software update",
        ],
      },
      {
        heading: "Repair options",
        bullets: ["Firmware recovery", "Main board storage repair or board replacement", "Power supply repair", "Backlight repair"],
      },
    ],
    faqs: [
      {
        q: "Will updating the software stop my TV restarting?",
        a: "If the cause is a known software bug, yes. If the TV restarts before you can reach the menu, inspection is needed to check storage and power.",
      },
    ],
    related: ["/tv-repair/android-tv-repair", "/tv-problems/tv-motherboard-repair", "/tv-problems/tv-power-supply-repair"],
    prefill: { problem: "Software Problem" },
  },
];


/** Added for the "TV Screen Repair" search priority. Honest about panel-replacement economics. */
tvProblems.push({
  slug: "tv-screen-repair",
  title: "TV Screen Repair & Panel Replacement",
  label: "TV Screen Repair",
  summary: "Cracked, broken, spotted or partly dead TV screens - what can be repaired and when a panel is needed.",
  metaTitle: "TV Screen Repair | Broken & Cracked TV Screen Options",
  metaDescription:
    "TV screen cracked, broken or partly dead? Learn which screen faults are repairable, when a panel replacement is needed, and get an honest estimate.",
  icon: "monitor",
  intro: [
    "\"Screen repair\" covers two very different situations. Many faults that look like a broken screen - a dark display, lines, dim patches or a blank picture - are actually caused by the backlight or a board, and those are repairable at reasonable cost. A physically cracked or impact-damaged panel is different: the glass panel itself cannot be repaired, only replaced.",
    "We diagnose which one you have before recommending anything, and tell you honestly when a panel replacement would cost close to a new TV.",
  ],
  sections: [
    {
      heading: "Screen problems that are often repairable",
      bullets: [
        "Screen dark but sound working (usually LED backlight)",
        "Dim, patchy or uneven brightness",
        "Lines or a garbled picture caused by the T-con board or panel cables",
        "Picture flickering or going blank after a few minutes",
      ],
    },
    {
      heading: "Screen damage that needs a panel replacement",
      bullets: [
        "Visible cracks, spider-web patterns or impact marks",
        "Ink-like black or coloured blotches spreading from a point",
        "A section of the screen permanently dead after a knock or pressure",
        "Liquid damage inside the panel",
      ],
    },
    {
      heading: "What a panel replacement involves",
      body: "The replacement must match your exact model and panel code. Availability varies by brand and age, and the part is the most expensive component in a TV - often a large share of the price of a new set. We confirm availability and the full cost first so you can decide whether it is worthwhile.",
    },
    {
      heading: "How we diagnose a screen problem",
      bullets: [
        "Inspect the panel for physical damage under bright light",
        "Run the torch test and backlight checks to rule out lighting faults",
        "Test the T-con board and panel connections",
        "Give you an estimate - repair, panel replacement or an honest 'not worth it'",
      ],
    },
  ],
  faqs: [
    {
      q: "Can a cracked TV screen be repaired?",
      a: "No - a cracked LCD, LED or OLED panel cannot be repaired, only replaced. Panel replacement is often expensive, so we confirm availability and cost before you decide.",
    },
    {
      q: "My TV screen is black but not cracked. Is the screen broken?",
      a: "Usually not. A black screen without physical damage is most often a backlight, power or board fault, which is typically repairable. See our sound-but-no-picture guide for the torch test.",
    },
    {
      q: "Does insurance cover TV screen damage?",
      a: "Some home or appliance insurance policies cover accidental damage. Check your policy before repair; we can provide a diagnosis and estimate for your claim.",
    },
  ],
  related: ["/tv-problems/tv-sound-but-no-picture", "/tv-problems/tv-screen-lines", "/tv-problems/tv-backlight-repair", "/tv-repair/led-tv-repair"],
  prefill: { problem: "Broken Screen" },
});

export const getTvProblem = (slug: string) => tvProblems.find((p) => p.slug === slug);
