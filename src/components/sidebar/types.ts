import { LucideIcon } from "lucide-react"

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  path: string;
  notifications?: number;
}