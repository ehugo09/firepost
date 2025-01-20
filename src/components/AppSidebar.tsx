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
} from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"

const menuItems = [
  { title: "Home", icon: Home, path: "/dashboard" },
  { title: "Post", icon: MessageSquare, path: "/compose" },
  { title: "Analytics", icon: BarChart, path: "/analytics" },
  { title: "Messages", icon: MessageCircle, path: "/messages" },
  { title: "Calendar", icon: Calendar, path: "/schedule" },
  { title: "Settings", icon: Settings, path: "/settings" },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                  >
                    <a href={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}