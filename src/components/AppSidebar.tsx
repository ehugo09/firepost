import { Home, MessageSquare, BarChart, MessageCircle, Calendar, Settings, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useLocation, useNavigate } from "react-router-dom"
import ThemeToggle from "./ThemeToggle"
import { supabase } from "@/integrations/supabase/client"

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
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate("/auth")
  }

  return (
    <Sidebar className="border-none rounded-lg">
      <SidebarHeader className="flex items-center justify-center p-4">
        <img 
          src="/lovable-uploads/e40f7ad8-9054-4083-b59a-46d925fd8a93.png" 
          alt="FirePost Logo" 
          className="h-8 w-auto dark:hidden"
        />
        <img 
          src="/lovable-uploads/37db4ad9-bca2-4dfd-92e9-eccc590f7e12.png" 
          alt="FirePost Logo" 
          className="h-8 w-auto hidden dark:block"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="h-full flex items-center justify-center">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                    className={`relative rounded-md ${
                      location.pathname === item.path
                        ? "bg-accent/10 text-accent before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-md before:border before:border-accent/20"
                        : ""
                    }`}
                  >
                    <a href={item.path} className="rounded-md">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.notifications && (
                    <SidebarMenuBadge className="bg-accent/10 text-accent">
                      {item.notifications}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-2">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}