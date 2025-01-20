import { SidebarFooter as Footer } from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import ThemeToggle from "../ThemeToggle"

interface SidebarFooterProps {
  onSignOut: () => void;
}

export const SidebarFooter = ({ onSignOut }: SidebarFooterProps) => {
  return (
    <Footer>
      <div className="flex items-center justify-between px-4 py-2">
        <ThemeToggle />
        <button
          onClick={onSignOut}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Sign out"
        >
          <LogOut className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </Footer>
  )
}