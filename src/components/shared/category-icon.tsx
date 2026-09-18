import {
  BookOpen,
  Briefcase,
  Calculator,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileText,
  FlaskConical,
  Globe,
  Monitor,
  Palette,
  PenTool,
  Star,
  Terminal,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Code2,
  Terminal,
  Database,
  Cpu,
  Cloud,
  FlaskConical,
  Calculator,
  Globe,
  Trophy,
  Briefcase,
  PenTool,
  Palette,
  Monitor,
  Star,
  FileText,
};

export const CATEGORY_ICON_OPTIONS = [
  { name: "BookOpen", label: "Study" },
  { name: "Code2", label: "Programming" },
  { name: "Terminal", label: "Console" },
  { name: "Database", label: "Databases" },
  { name: "Cpu", label: "Systems" },
  { name: "Cloud", label: "Cloud" },
  { name: "FlaskConical", label: "Science" },
  { name: "Calculator", label: "Mathematics" },
  { name: "Globe", label: "Languages" },
  { name: "Trophy", label: "Exams" },
  { name: "Briefcase", label: "Career" },
  { name: "PenTool", label: "Writing" },
  { name: "Palette", label: "Design" },
  { name: "Monitor", label: "Web" },
  { name: "Star", label: "Featured" },
  { name: "FileText", label: "General" },
] as const;

export function CategoryIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (name ? CATEGORY_ICONS[name] : undefined) ?? BookOpen;
  return <Icon aria-hidden="true" className={className} />;
}
