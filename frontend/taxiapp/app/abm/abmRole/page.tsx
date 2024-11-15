"use client";
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

interface Role {
  id: number;
  name: string;
}

const ABMRole = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingRoleData, setEditingRoleData] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState<Role | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }

        const token = session.token;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleInsert = () => {
    setNewRole({
      id: 0,
      name: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: number | null) => {
    const { name, value } = e.target;
    if (id !== null) {
      setRoles(prevRoles =>
        prevRoles.map(role =>
          role.id === id ? { ...role, [name]: value } : role
        )
      );
    } else if (editingRoleId !== null) {
      setEditingRoleData(prevRole => (prevRole ? { ...prevRole, [name]: value } : null));
    } else {
      setNewRole(prevNewRole => (prevNewRole ? { ...prevNewRole, [name]: value } : null));
    }
  };

  const handleSaveEdit = async (roleId: number) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.token;

    const roleToUpdate = roles.find(role => role.id === roleId);
    if (roleToUpdate) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles/${roleId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(roleToUpdate),
        });
        const updatedRole = await response.json();
        setRoles(roles.map(role => role.id === roleId ? updatedRole : role));
        setEditingRoleId(null);
      } catch (error) {
        console.error('Error updating role:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
  };

  const handleEdit = (roleId: number) => {
    const roleToEdit = roles.find(role => role.id === roleId);
    if (roleToEdit) {
      setEditingRoleId(roleId.toString());
      setEditingRoleData(roleToEdit);
    }
  };

  const handleDelete = async (roleId: number) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.token;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setRoles(roles.filter(role => role.id !== roleId));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleSaveNewRole = async () => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.token;

    try {
      console.log(newRole);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRole),
      });
      const savedRole = await response.json();
      setRoles([...roles, savedRole]);
      setNewRole(null);
    } catch (error) {
      console.error('Error saving new role:', error);
    }
  };

  const handleCancelNewRole = () => {
    setNewRole(null);
  };

return (
    <div className='geist-sans-font bg-secondary'>
      <div className='table-container'>
      {!newRole && (
        <Button onClick={handleInsert} className="text-secondary bg-secondary-foreground shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:bg-yellow-500 font-bold px-4 p-4 rounded mt-4 mx-4">
          + Insert New Role
        </Button>
      )}
      <div className='m-4 rounded-2xl bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles?.map(role => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>
                {editingRoleId === role.id.toString() ? (
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                    type="text"
                    name="name"
                    value={role.name}
                    onChange={(e) => handleInputChange(e, role.id)}
                  />
                ) : (
                  role.name
                )}
              </TableCell>
              <TableCell className='text-right'>
                  {editingRoleId === role.id.toString() ? (
                    <>
                      <Button onClick={() => handleSaveEdit(role.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Save</Button>
                      <Button onClick={handleCancelEdit} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(role.id)} className="bg-blue-500 m-1 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Edit</Button>
                      <Button onClick={() => handleDelete(role.id)} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Delete</Button>
                    </>
                  )}
                </TableCell>
            </TableRow>
          ))}
          {newRole && (
            <TableRow>
              <TableCell>{newRole.id}</TableCell>
              <TableCell>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="Name"
                  name="name"
                  value={newRole.name}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <button onClick={handleSaveNewRole} className='bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded'>Send</button>
                <button onClick={handleCancelNewRole} className='bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded'>Cancel</button>
              </TableCell>
            </TableRow>
          )}
          </TableBody>
         </Table>
        </div>
       </div>
      </div>
  );
};

export default ABMRole;