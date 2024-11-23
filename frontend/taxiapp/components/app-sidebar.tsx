'use client'

import { Calendar, Home, LayoutDashboard, LogIn, Search, Settings,UserPlus,LogOut, User, Car } from "lucide-react"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    url: "/dash",
    icon: LayoutDashboard,
  },
  {
    title: "Calcular costo de viaje",
    url: "/estimar",
    icon: Calendar,
  },
  {
    title: "Viajes",
    url: "/rides",
    icon: Car,
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
  },
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
                {isOperatorOrAdmin && (
                <SidebarMenuItem>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="abm">
                      <AccordionTrigger>Gestionar</AccordionTrigger>
                        <AccordionContent>
                        <div className="flex flex-col">
                          <Link className="m-1" href="/abm/abmUser">
                          <span className="sidebar-subitem">Gestionar Usuarios</span>
                          </Link>
                          <Link className="m-1" href="/abm/abmDriver">
                          <span className="sidebar-subitem">Gestionar Conductores</span>
                          </Link>
                          <Link className="m-1" href="/abm/abmVehicle">
                          <span className="sidebar-subitem">Gestionar Autos</span>
                          </Link>
                          <Link className="m-1" href="/abm/abmRole">
                          <span className="sidebar-subitem">Gestionar Roles</span>
                          </Link>
                        </div>
                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </SidebarMenuItem>)}

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