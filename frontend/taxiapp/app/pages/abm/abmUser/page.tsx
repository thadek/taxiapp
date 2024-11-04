"use client";
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';


interface Role {
  id: number;
  name: string;
}

interface User {
  id: string;
  name: string;
  lastname: string;
  username: string;
  password?: string;
  email: string;
  phone: string;
  is_disabled: string | null;
  deleted?: boolean;
  roles: Role[];
}

const ABMUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserData, setEditingUserData] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  useEffect(() => {
    // Realizar la solicitud al backend para obtener los usuarios
    const fetchUsers = async () => {
      try {
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }

        const token = session.user.token;
        console.log('Token:', token);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setUsers(data.content);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }

        const token = session.user.token;
        console.log('Token:', token);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setAvailableRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string | null) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    if (id) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? { ...user, [name]: inputValue } : user
        )
      );
    } else if (editingUserId) {
      setEditingUserData(prevUser => (prevUser ? { ...prevUser, [name]: inputValue } : null));
    } else {
      setNewUser(prevNewUser => (prevNewUser ? { ...prevNewUser, [name]: inputValue } : null));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>, role: Role) => {
    const { checked } = e.target;
    if (editingUserId) {
      setEditingUserData(prevUser => {
        if (!prevUser) return null;
        const updatedRoles = checked
          ? [...prevUser.roles, role]
          : prevUser.roles.filter(r => r.id !== role.id);
        return { ...prevUser, roles: updatedRoles };
      });
    } else {
      setNewUser(prevNewUser => {
        if (!prevNewUser) return null;
        const updatedRoles = checked
          ? [...prevNewUser.roles, role]
          : prevNewUser.roles.filter(r => r.id !== role.id);
        return { ...prevNewUser, roles: updatedRoles };
      });
    }
  };

  const handleInsert = () => {
    setNewUser({
      id: '',
      name: '',
      lastname: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      is_disabled: null,
      deleted: false,
      roles: []
    });
  };

  const handleSaveNewUser = async () => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.user.token;

    try {
      console.log(newUser);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const savedUser = await response.json();
      setUsers([...users, savedUser]);
      setNewUser(null);
    } catch (error) {
      console.error('Error saving new user:', error);
    }
  };

  const handleCancelNewUser = () => {
    setNewUser(null);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleEdit = (userId: string) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setEditingUserId(userId);
      setEditingUserData(userToEdit);
    }
  };

  const handleSaveEdit = async (userId: string) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.user.token;

    const userToUpdate = users.find(user => user.id === userId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToUpdate),
      });
      const updatedUser = await response.json();
      setUsers(users.map(user => user.id === userId ? updatedUser : user));
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.user.token;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(users.map(user => user.id === userId ? { ...user, deleted: true } : user));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDisable = async (userId: string) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.user.token;

    const userToDisable = users.find(user => user.id === userId);
    if (userToDisable) {
      userToDisable.is_disabled = new Date().toISOString();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userToDisable),
        });
        const updatedUser = await response.json();
        setUsers(users.map(user => user.id === userId ? updatedUser : user));
      } catch (error) {
        console.error('Error disabling user:', error);
      }
    }
  };

  const handleEnable = async (userId: string) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.user.token;

    const userToEnable = users.find(user => user.id === userId);
    if (userToEnable) {
      userToEnable.is_disabled = null;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userToEnable),
        });
        const updatedUser = await response.json();
        setUsers(users.map(user => user.id === userId ? updatedUser : user));
      } catch (error) {
        console.error('Error enabling user:', error);
      }
    }
  };

  return (
    <div className='geist-sans-font bg-secondary'>
      <div className='table-container'>
      {!newUser && (
        <Button onClick={handleInsert} className="text-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:bg-yellow-500 font-bold px-4 p-4 rounded m-4">
          + Insert New User
        </Button>
      )}
      <div className='mx-4 border rounded-2xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
      <Table className='table-fixed'>
        <TableHeader className='text-black'>
          <TableRow className='bg-background'>
            <TableHead className='text-foreground'>Id</TableHead>
            <TableHead className='text-foreground'>Name</TableHead>
            <TableHead className='text-foreground'>Last Name</TableHead>
            <TableHead className='text-foreground'>Username</TableHead>
            <TableHead className='text-foreground'>Email</TableHead>
            <TableHead className='text-foreground'>Phone</TableHead>
            <TableHead className='text-foreground'>Is Disabled</TableHead>
            <TableHead className='text-foreground'>Deleted</TableHead>
            <TableHead className='text-foreground'>Roles</TableHead>
            <TableHead className='text-foreground'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map(user => (
            <TableRow key={user.id} className={user.deleted ? 'deleted' : ''}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={(e) => handleInputChange(e, user.id)}
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="lastname"
                    value={user.lastname}
                    onChange={(e) => handleInputChange(e, user.id)}
                  />
                ) : (
                  user.lastname
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={(e) => handleInputChange(e, user.id)}
                  />
                ) : (
                  user.username
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={(e) => handleInputChange(e, user.id)}
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={(e) => handleInputChange(e, user.id)}
                  />
                ) : (
                  user.phone
                )}
              </TableCell>
              <TableCell>{user.is_disabled}</TableCell>
              <TableCell>{user.deleted ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                {user.roles?.map(role => role.name).join(', ')}
              </TableCell>
              <TableCell>
                  {editingUserId === user.id ? (
                    <>
                      <Button onClick={() => handleSaveEdit(user.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Save</Button>
                      <Button onClick={handleCancelEdit} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(user.id)} className="bg-blue-500 m-1 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Edit</Button>
                      <Button onClick={() => handleDelete(user.id)} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Delete</Button>
                      {user.is_disabled ? (
                        <Button onClick={() => handleEnable(user.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Enable</Button>
                      ) : (
                        <Button onClick={() => handleDisable(user.id)} className="bg-orange-500 m-1 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Disable</Button>
                      )}
                    </>
                  )}
                </TableCell>
            </TableRow>
          ))}
          {newUser && (
            <TableRow>
              <TableCell>{newUser.id}</TableCell>
              <TableCell>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="Name"
                  name="name"
                  value={newUser.name}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="Last Name"
                  name="lastname"
                  value={newUser.lastname}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="Username"
                  name="username"
                  value={newUser.username}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" placeholder="E-mail"
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="+542991234567"
                  name="phone"
                  value={newUser.phone}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>{newUser.is_disabled}</TableCell>
              <TableCell>{newUser.deleted ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                {Array.isArray(availableRoles) && availableRoles.map(role => (
                 
                  <div className="role-label">
                    <div className="checkbox-wrapper-26">
                      <input
                        type="checkbox"
                        id={`role-${role.id}-new`}
                        checked={newUser.roles.some(r => r.id === role.id)}
                        onChange={(e) => handleRoleChange(e, role)}
                      />
                      <label htmlFor={`role-${role.id}-new`}>
                        <div className="tick_mark"></div>
                      </label>
                    </div>
                    <span className="role-name">{role.name}</span>
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <button onClick={handleSaveNewUser} className='bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded'>Send</button>
                <button onClick={handleCancelNewUser} className='bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded'>Cancel</button>
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

export default ABMUser;