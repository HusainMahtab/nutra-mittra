import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full h-full flex-1 flex flex-col">
        <SidebarTrigger className="fixed z-[9]"/>
        {children}
      </main>
    </SidebarProvider>
  )
}
