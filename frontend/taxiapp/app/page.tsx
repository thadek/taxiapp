import Image from "next/image";

export default function Home() {
  return (
      <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center h-screen">
              <h1>Bienvenido a la taxiApp</h1>

              <a href="/login">Iniciar sesion</a>
              <a href="/register">Registrarse</a>

          </div>
      </div>
  );
}
