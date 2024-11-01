"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState<string>("test");
  const [lastname, setLastname] = useState<string>("test");
  const [username, setUsername] = useState<string>("test");
  const [email, setEmail] = useState<string>("test@test.com");
  const [phone, setPhone] = useState<string>("+54299424");
  const [password, setPassword] = useState<string>("123123");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastname,
          username,
          password,
          phone,
          email,
        }),
      }
    );

    const responseAPI = await res.json();

    if (!res.ok) {
      setErrors(responseAPI.message);
      return;
    }

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex bg-gray-900 flex-col justify-center font-[sans-serif] sm:h-screen p-4 text-white">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
      <h1 className="mb-7 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Registrar Usuario
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className=" text-sm mb-2 block">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              name="name"
              className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label className=" text-sm mb-2 block">Last name</label>
            <input
              name="lastname"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
              placeholder="Enter last name"
              required
            />
          </div>
          <div>
            <label className=" text-sm mb-2 block">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              name="username"              
              className=" bg-white border text-gray-800 border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"              
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>          
          <div>
            <label className="  text-sm mb-2 block">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              className=" bg-white border text-gray-800 border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            <label className=" text-sm mb-2 block">Phone number</label>
            <input
              type="text"
              placeholder="+54 9 11 1234-5678"
              name="phone"
              className=" bg-white border text-gray-800 border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <div>
            <label className=" text-sm mb-2 block">Email</label>
            <input
              type="email"
              placeholder="email@ejemplo.com"
              name="email"
              className=" bg-white border text-gray-800 border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <button type="submit" className="w-full  bg-green-500 duration-150 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
            Register
          </button>
        </div>
      </form>

      {Array.isArray(errors) && errors.length > 0 && (
        <div className="alert alert-danger mt-2">
          <ul className="mb-0">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
};
export default RegisterPage;