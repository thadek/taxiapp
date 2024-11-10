'use client'

import { Calendar, Home, LayoutDashboard, LogIn, Search, Settings,UserPlus,LogOut, User } from "lucide-react"
import { Logo } from "@/components/ui/logo"

import { useSession, signIn, signOut } from "next-auth/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { checkMultipleRoles, checkRole } from "@/app/utils/role-check"




const itemsWithoutLogin = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Iniciar sesión",
    url: "/login",
    icon: LogIn,
  },
  {
    title: "Registrarse",
    url: "/register",
    icon: UserPlus,
  }
]


const itemsUser = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Perfil",
    url: "/profile",
    icon: User,
  },
  {
    title:"Cerrar sesión",
    url:"/api/auth/signout",
    icon: LogOut
  }


]

// Menu items.
const items = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Calcular costo de viaje",
    url: "/estimar",
    icon: Calendar,
  },
  {
    title: "Buscar",
    url: "#",
    icon: Search,
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Vehiculos", // New page item
    url: "pages/soap",
    icon: Home, // Replace with an appropriate icon
  }
]

export  function AppSidebar() {


  const { data: session, status } = useSession();

  const isOperatorOrAdmin = session && checkMultipleRoles(["ROLE_ADMIN","ROLE_OPERATOR"], session.user.roles);


  if(status === "loading") {
    return <></>
  }


  return (
    <Sidebar>
      <Dialog>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>

            <SidebarGroupContent>
              <SidebarMenu>
                {isOperatorOrAdmin && items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {!session && itemsWithoutLogin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {session && checkMultipleRoles(["ROLE_USER"],session.user?.roles) && itemsUser.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>


{/*
TODO: Hice una prueba para ver si implementar calcular el estimado en un dialog quedaba bien
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent> */}


          <ModeToggle />
        </SidebarFooter>
      </Dialog>
    </Sidebar>
  )
}