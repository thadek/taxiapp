"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import NextImage from 'next/image';
import {Image} from '@nextui-org/react';

export default function Login() {
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect:false,
    });

    if (responseNextAuth?.error) {   
     toast.error(`Las credenciales no son correctas`);
      return
    }

    toast.success("Sesión iniciada correctamente");

    router.push(responseNextAuth?.url || "/");
  };

  return (
    <section className="  bg-slate-950 bg-no-repeat bg-cover ">
      <div className="flex items-center justify-center px-6 py-8 mx-auto md:h-screen rounded-tl-lg rounded-bl-lg lg:py-0">
      <div className="w-full h-[600px] bg-slate-900   shadow  md:mt-0 sm:max-w-md xl:p-0 ">
          <div className=" ">
          <Image
              as={NextImage}
              src="/lib/images/taxi_blur.jpg"
              alt="taxi"

              width={700}
              height={600}/>
          
          </div>
        </div>
        
        <div className=" h-[600px] items-center flex w-full bg-white dark:bg-slate-900 dark:text-white text-gray-900 rounded-br-lg rounded-tr-lg   shadow  md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 w-full">
            <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl ">
              Iniciar sesión
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="test@algo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-black bg-green-600 duration-150 hover:bg-green-700  font-bold  rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Iniciar sesión
              </button>
              {/*errors && <p className="text-sm text-red-500">{errors}</p>*/}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Sin cuenta?  <Link href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Registrate</Link>
              </p>
            </form>
          </div>
        </div>
        
      </div>
      
    </section>
  );
}