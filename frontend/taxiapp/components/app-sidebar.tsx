"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CarIcon,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  HomeIcon,
  LayoutDashboard,
  Map,
  PieChart,
  Receipt,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavFixed } from "@/components/nav-fixed"
import { NavUser } from "@/components/nav-user"
import { LogoHeader } from "@/components/logo-header"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { checkMultipleRoles, checkRole } from "@/app/utils/role-check"
import { useSession, signIn, signOut } from "next-auth/react"

import { Calendar,  LogIn, Search, Settings,UserPlus,LogOut, User, Car } from "lucide-react"

const itemsWithoutLogin = [
  {
    name: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    name: "Iniciar sesión",
    url: "/login",
    icon: LogIn,
  },
  {
    name: "Registrarse",
    url: "/register",
    icon: UserPlus,
  }
]


const itemsUser = [
  {
    name: "Inicio",
    url: "/",
    icon: Home,
  }


]

// This is sample data.
const data = {
  navMain: [{
    title: "Viajes",
    url: "#",
    icon: CarIcon,
    isActive: true,
    role: ["admin", "operator"],
    items: [
      {
        title: "Ver todos",
        url: "/rides",
      },
      {
        title: "Estimar costo",
        url: "/estimar",
      }
    ],
  },

  {
    title: "Gestionar",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    role: ["admin", "operator"],
    items: [
      {
        title: "Usuarios",
        url: "/abm/abmUser",
      },
      {
        title: "Conductores",
        url: "/abm/abmDriver",
      },
      {
        title: "Vehículos",
        url: "/abm/abmVehicle",
      },
      {
        title: "Roles",
        url: "/abm/abmRole"
      }
    ],
  },

  ],
  fixed: [
    {
      name: "Inicio",
      url: "/",
      icon: HomeIcon,
    },
    {
      name: "Dashboard",
      url: "/dash",
      icon: LayoutDashboard,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const { data: session, status } = useSession();
  const isOperatorOrAdmin = session && checkMultipleRoles(["ROLE_ADMIN","ROLE_OPERATOR"], session.user.roles);
  
  if (status === "loading") return null;
  
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>
      <SidebarContent>
        {session && checkMultipleRoles(["ROLE_USER"],session.user?.roles) && <NavFixed items={itemsUser} />}
        
        {isOperatorOrAdmin && <><NavFixed items={data.fixed} />
        <NavMain items={data.navMain} /></>}
        {!session && <NavFixed items={itemsWithoutLogin} />}
        

      </SidebarContent>
      <SidebarFooter>

        <NavUser user={session?.user} />

      </SidebarFooter>




      <SidebarRail />
    </Sidebar>
  )
}
