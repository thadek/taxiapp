"use client"
import * as React from "react"

import {
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "./ui/logo"

export function LogoHeader({
}) {
  const {open } = useSidebar()
  
  return (
    <SidebarMenu>   
      {!open && <div className="flex  size-8 items-center justify-center rounded-lg bg-slate-900 text-sidebar-primary-foreground">
             <Logo text="T"/>
              </div>}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
              {open &&   <Logo text="TaxiApp"/>}
                </span>
                
              </div>
              
  
    </SidebarMenu>
  )
}
