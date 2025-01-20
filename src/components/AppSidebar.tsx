import { Home, MessageSquare, BarChart, MessageCircle, Calendar, Settings } from "lucide-react"
import { Sidebar } from "@/components/ui/sidebar"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { SidebarHeader } from "./sidebar/SidebarHeader"
import { SidebarFooter } from "./sidebar/SidebarFooter"
import { SidebarMenu } from "./sidebar/SidebarMenu"
import { MenuItem } from "./sidebar/types"

const menuItems: MenuItem[] = [
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

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <Sidebar className="border-none rounded-lg">
      <SidebarHeader />
      <SidebarMenu 
        menuItems={menuItems}
        currentPath={location.pathname}
        onNavigate={handleNavigation}
      />
      <SidebarFooter onSignOut={handleSignOut} />
    </Sidebar>
  )
}