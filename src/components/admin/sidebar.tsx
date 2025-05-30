import { SquarePlus,User,Apple } from "lucide-react"

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

// Menu items.
const items = [
  {
    title: "Create-Fruit",
    url: "/admin-panel/create-fruit",
    icon: SquarePlus,
  },
   {
    title: "All",
    url: "/admin-panel/all",
    icon: Apple,
  },
  {
    title: "All-Users",
    url: "/admin-panel/all-users",
    icon: User,
  },
 
]

export function AdminSidebar() {
  return (
    <Sidebar className="pt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-lg">Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
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
