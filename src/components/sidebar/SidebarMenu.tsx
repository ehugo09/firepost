import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu as Menu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { MenuItem } from "./types"

interface SidebarMenuProps {
  menuItems: MenuItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const SidebarMenu = ({ menuItems, currentPath, onNavigate }: SidebarMenuProps) => {
  return (
    <SidebarContent>
      <SidebarGroup className="flex flex-col justify-center h-[calc(100vh-12rem)] gap-12 pt-6">
        <Button 
          variant="default"
          size="lg"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => onNavigate('/compose')}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create a post
        </Button>
        <SidebarGroupContent>
          <Menu className="space-y-3">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => onNavigate(item.path)}
                  tooltip={item.title}
                  isActive={currentPath === item.path}
                  className={`relative rounded-md ${
                    currentPath === item.path
                      ? "bg-accent/10 text-accent before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-md before:border before:border-accent/20"
                      : ""
                  }`}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.notifications && (
                  <SidebarMenuBadge className="bg-accent/10 text-accent">
                    {item.notifications}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </Menu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}