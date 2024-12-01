"use client"

import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';

import React, { useEffect } from 'react';
import LoginContainer from '../LoginContainer/LoginContainer';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from '../mode-toggle';





const Navbar = () => {





    return (
        <div className="w-full">
        <NavigationMenu  className="p-3 flex justify-between">
            <SidebarTrigger />
            <ModeToggle />
           
        </NavigationMenu>
        </div>
    );
};

export default Navbar;