import {
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  FileText,
  GraduationCap,
  Handshake,
  Inbox,
  LayoutDashboard,
  Link2,
  Scale,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { ModuleIconKey } from "@/lib/begear/constants";

export const moduleIconMap: Record<ModuleIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  academy: GraduationCap,
  ats: UsersRound,
  placement: Handshake,
  management: Building2,
  shifts: CalendarDays,
  staffing: BriefcaseBusiness,
  crm: ChartNoAxesCombined,
  input: Inbox,
  integrations: Link2,
  documents: FileText,
  compliance: Scale,
  ai: Bot,
};
