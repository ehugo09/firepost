import { Home, MessageSquare, BarChart, MessageCircle, Calendar, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"

const menuItems = [
  { title: "Home", icon: Home, path: "/dashboard" },
  { title: "Post", icon: MessageSquare, path: "/compose" },
  { title: "Analytics", icon: BarChart, path: "/analytics" },
  { title: "Messages", icon: MessageCircle, path: "/messages", notifications: 3 },
  { title: "Calendar", icon: Calendar, path: "/schedule" },
  { title: "Settings", icon: Settings, path: "/settings" },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                    className={`relative ${
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-lg before:border before:border-primary/20"
                        : ""
                    }`}
                  >
                    <a href={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.notifications && (
                    <SidebarMenuBadge className="bg-primary/10 text-primary">
                      {item.notifications}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}