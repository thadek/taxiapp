"use client";

export default function Header(){
    return (
        <header className="flex items-center justify-between bg-forest text-white p-4 rounded-b-xl pl-24">
            <a href="#" className="text-white">TaxiApp</a>
            <div className="flex gap-4 pr-24">
                <a href="/login" className="text-white">Iniciar sesion</a>
                <a href="/register" className="text-white">Registrarse</a>
            </div>
        </header>
    )
}