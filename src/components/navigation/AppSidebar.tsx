import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  UserCog,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  requiredRoles: UserRole[];
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    requiredRoles: ['admin', 'supervisor', 'agente'],
  },
  {
    name: "Leads",
    href: "/leads",
    icon: Users,
    requiredRoles: ['admin', 'supervisor', 'agente'],
  },
  {
    name: "Chat en vivo",
    href: "/chat",
    icon: MessageSquare,
    requiredRoles: ['admin', 'supervisor', 'agente'],
  },
  {
    name: "Reportes",
    href: "/reportes",
    icon: BarChart3,
    requiredRoles: ['admin', 'supervisor'],
  },
  {
    name: "Usuarios",
    href: "/usuarios",
    icon: UserCog,
    requiredRoles: ['admin'],
  },
  {
    name: "Configuración",
    href: "/configuracion",
    icon: Settings,
    requiredRoles: ['admin'],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { hasPermission } = useAuth();

  // Filter navigation based on user permissions
  const filteredNavigation = navigation.filter(item => 
    hasPermission(item.requiredRoles)
  );

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-sidebar-foreground/70">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild size="lg" isActive={isActive}>
                      <NavLink
                        to={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {state === "expanded" && <span>{item.name}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}