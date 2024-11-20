'use client'
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";
import { Button } from "@/components/ui/button";


export default function LoginContainer({ children }: any) {

    const { data: session, status } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  

    if(status === "loading") {
      return <></>
    }

    return (
      <>
        {session ? (
          <div className="relative hidden lg:inline-block lg:ml-auto lg:mr-3">
            <button
              className="text-black font-bold py-1 px-4 text-xs bg-gray-300 hover:bg-gray-100 rounded-xl transition duration-200"
              onClick={toggleDropdown}
            >
              {session.user.name}
            </button>
            {isDropdownOpen && (
              <div className="z-400 absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg ">
                <button
                  className="block w-full text-left font-bold px-4 py-2 text-sm  text-gray-900 hover:bg-gray-100"
                  onClick={() => {
                    signOut();
                    setIsDropdownOpen(false);
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className=" flex   p-1 gap-4 ">
             <Link
              href="/register"
              className="py-2 px-4 bg-gray-600 hover:bg-gray-800 text-sm text-white font-bold rounded-xl transition duration-200"
              
            >
              Registrarse
           
            </Link>
            <Link
              href="/login"
              className="py-2 px-4 bg-green-500 hover:bg-green-600 text-sm text-white font-bold rounded-xl transition duration-200"
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </>
    );
}