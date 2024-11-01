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





const Navbar = () => {





    return (
        <div className="w-full">
        <NavigationMenu  >
            <SidebarTrigger />
           
            <NavigationMenuList >
             {  /* <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>Link</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem*/}
                <NavigationMenuItem>
                <LoginContainer />
                </NavigationMenuItem>

                
            </NavigationMenuList>
        </NavigationMenu>
        </div>
    );
};

export default Navbar;