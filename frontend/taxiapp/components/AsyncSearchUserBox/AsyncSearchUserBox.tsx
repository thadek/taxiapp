'use client'

import React from "react";
import { Autocomplete, AutocompleteItem,  Spinner } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import {  getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";





type User = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  roles: Role[];
  is_disabled: boolean;
}

type Role = {
  id: string;
  name: string;
}



export default function ComboBoxSearchUser({
  onSelectionChange,
}: {
  onSelectionChange: (key: React.Key | null) => void;
}) {
  const { data: session } = useSession();
  const backUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const [inputValue, setInputValue] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session && inputValue.trim()) {
      const fetchUsers = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${backUrl}/users/search?q=${inputValue}&size=50`, {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }
          );
          const data = await response.json();
          setUsers(data.content);
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [session, inputValue]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          user.lastname.toLowerCase().includes(inputValue.toLowerCase()) ||
          user.phone.includes(inputValue)
      )
    );
  }, [inputValue, users]);

  const handleSelectionChange = (user: User) => {
    onSelectionChange(user.id);
    setInputValue(`${user.name} - ${user.lastname} - ${user.email} - ${user.phone}`);
  };

  const handleCreateNewUser = () => {
    // Lógica para redirigir a la página de creación de usuario
    window.location.href = "/abm/AbmUser";
  };

  return (
    <div className="relative">
      <Input
        type="text"
        label="Cliente"
        variant="underlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full "
        placeholder="Buscar por nombre, apellido o teléfono..."
      />

      {isLoading && <div className="absolute bottom-3 right-5"><Spinner size="sm"/></div>}

      {filteredUsers.length > 0 && (
        <ul className="absolute w-full mt-2    bg-slate-800 shadow-lg z-20 transition duration-250">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className="cursor-pointer p-2 transition  duration-100 hover:bg-slate-700"
              onClick={() => handleSelectionChange(user)}
            >
              {user.name} {user.lastname} ({user.email}) - {user.phone}
            </li>
          ))}
        </ul>
      )}

      
    </div>
  );
}
