import {
  Network,
  ArrowLeftRight,
  ShieldCheck,
  Type,
  Regex,
  Braces,
  Code,
  Link,
  Clock,
  Ruler,
  Palette,
  Image,
  FileArchive,
  Table,
  Workflow,
  Sparkles,
  BadgeCheck,
  MonitorSmartphone,
  ScrollText,
  Webhook,
  TrendingUp,
  Accessibility,
  MapPin,
  Banknote,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Network,
  ArrowLeftRight,
  ShieldCheck,
  Type,
  Regex,
  Braces,
  Code,
  Link,
  Clock,
  Ruler,
  Palette,
  Image,
  FileArchive,
  Table,
  Workflow,
  Sparkles,
  BadgeCheck,
  MonitorSmartphone,
  ScrollText,
  Webhook,
  TrendingUp,
  Accessibility,
  MapPin,
  Banknote,
  BookOpen,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const C = map[name] ?? Sparkles;
  return <C className={className} aria-hidden />;
}
