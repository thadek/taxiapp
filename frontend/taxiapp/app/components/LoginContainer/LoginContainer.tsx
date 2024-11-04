'use client'
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button";


export default function LoginContainer({ children }: any) {

    const { data: session } = useSession();

    return (<>

        {session ? (
            <Button className="geist-sans-font bg-destructive hover:bg-red-700 hidden lg:inline-block lg:ml-3 lg:mr-3 py-2 px-6 text-sm text-secondary rounded-xl transition duration-200" onClick={() => signOut()} >
              Cerrar sesión
            </Button>
        ) : (
            <>
            <Button className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-300 hover:bg-gray-400 text-sm text-gray-900 rounded-xl transition duration-200">
                <Link href="/register">
                    Registrarse
                </Link>
            </Button>
            <Button className="hidden lg:inline-block py-2 px-6 bg-green-500 hover:bg-green-600  text-sm text-white rounded-xl transition duration-200">
                <Link href="/login">
                    Iniciar sesión
                </Link>
            </Button>
            </>
        )}
      
    </>);
}