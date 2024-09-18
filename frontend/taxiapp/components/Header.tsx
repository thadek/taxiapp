"use client";

export default function Header(){
    return (
        <header className="flex items-center justify-between bg-blue-500 text-white p-4 rounded-b-xl">
            <a href="#" className="text-white">TaxiApp</a>
            <div className="flex gap-4">
                <a href="/login" className="text-white">Iniciar sesion</a>
                <a href="/register" className="text-white">Registrarse</a>
            </div>
        </header>
    )
}