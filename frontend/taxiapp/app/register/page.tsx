'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@nextui-org/react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { set } from "date-fns"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastname: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  username: z.string().min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Debe ser un email válido.",
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Debe ser un número de teléfono válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export default function RegistrationForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastname: "",
      username: "",
      email: "",
      phone: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    form.reset();
   
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const responseAPI = await res.json();

    if (!res.ok) {
      setErrors(responseAPI.errors);
      return;
    }

    const responseNextAuth = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }

    router.push("/");
    
  }

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="flex w-full max-w-2xl ">
       
        <Card className="flex-1 bg-slate-900/50 border-none">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-slate-200 mb-6">Registrarse</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese su nombre" {...field} className="bg-slate-800/50 border-slate-700 text-slate-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese su apellido" {...field} className="bg-slate-800/50 border-slate-700 text-slate-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Nombre de usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese su nombre de usuario" {...field} className="bg-slate-800/50 border-slate-700 text-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@ejemplo.com" type="email" {...field} className="bg-slate-800/50 border-slate-700 text-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Contraseña</FormLabel>
                      <FormControl>
                        <Input placeholder="******" type="password" {...field} className="bg-slate-800/50 border-slate-700 text-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+54115487847" {...field} className="bg-slate-800/50 border-slate-700 text-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" isLoading={form.formState.isSubmitting} className="w-full bg-blue-500 hover:bg-blue-600">
                  Registrar
                </Button>
                <div className="text-center text-sm text-slate-400">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300">
                    Iniciar sesión
                  </Link>
                </div>
              </form>
            </Form>
            {errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-500 text-white rounded-md">
                <ul className="list-disc list-inside">
                 Ocurrio un un error al registrar el usuario
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

