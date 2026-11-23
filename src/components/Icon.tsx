import {
  Box,
  Cable,
  Cpu,
  Disc,
  Home,
  Layers,
  Maximize2,
  Menu,
  Monitor,
  MonitorOff,
  MonitorPlay,
  MonitorSmartphone,
  Plug,
  Power,
  Projector,
  Radio,
  RefreshCw,
  Sparkles,
  Speaker,
  Sun,
  Tv,
  Volume2,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/content/types";

const MAP: Record<IconKey, LucideIcon> = {
  tv: Tv,
  monitor: Monitor,
  smart: MonitorSmartphone,
  sparkles: Sparkles,
  layers: Layers,
  android: MonitorPlay,
  fourk: Maximize2,
  power: Power,
  screenOff: MonitorOff,
  volume: Volume2,
  lines: Menu,
  sun: Sun,
  cpu: Cpu,
  plug: Plug,
  hdmi: Cable,
  wifi: Wifi,
  refresh: RefreshCw,
  speaker: Speaker,
  amp: Radio,
  projector: Projector,
  disc: Disc,
  box: Box,
  home: Home,
};

export function Icon({ name, className = "h-6 w-6" }: { name: IconKey; className?: string }) {
  const C = MAP[name] ?? Tv;
  return <C className={className} aria-hidden />;
}
