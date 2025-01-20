import { SidebarHeader as Header } from "@/components/ui/sidebar"

export const SidebarHeader = () => {
  return (
    <Header className="flex items-center justify-center p-4">
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
    </Header>
  )
}