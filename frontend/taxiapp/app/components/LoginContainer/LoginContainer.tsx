'use client'
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"


export default function LoginContainer({ children }: any) {

    const { data: session } = useSession();

    return (<>

        {session ? (
            <button className="hidden lg:inline-block lg:ml-3 lg:mr-3 py-2 px-6 bg-gray-300 hover:bg-gray-100 text-sm text-gray-900 font-bold  rounded-xl transition duration-200" onClick={() => signOut()} >
              Cerrar sesión
            </button>
        ) : (
            <>
            <Link className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-300 hover:bg-gray-100 text-sm text-gray-900 font-bold  rounded-xl transition duration-200" href="/register">
                Registrarse
            </Link>
            <Link className="hidden lg:inline-block py-2 px-6 bg-green-500 hover:bg-green-600  text-sm text-white font-bold rounded-xl transition duration-200" href="/login">Iniciar sesión</Link>
            </>
        )}
      
    </>);
}