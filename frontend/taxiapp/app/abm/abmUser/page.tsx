"use client";
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { getUsers, createUser, updateUser, deleteUser } from '@/app/queries/abm';
import { getRoles } from '@/app/queries/abm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


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
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  useEffect(() => {
    // Realizar la solicitud al backend para obtener los usuarios
    const fetchUsers = async () => {
      const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }
        const token = session.token;
      try {
        const data = await getUsers(token);
        setUsers(data.content);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchRoles = async () => {
      const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }
        const token = session.token;
      try {
        const data = await getRoles(token);
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
        const token = session.token;
    try {
      const createdUser = await createUser(newUser, token);
      setUsers([...users, createdUser]);
      setNewUser(null);
    } catch (error) {
      console.error('Error creating user:', error);
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
      setSelectedRoles([]);
    }
  };

  const handleSaveEdit = async (userId: string) => {
    const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }
    const token = session.token;

    const userToUpdate = users.find(user => user.id === userId);
    if (userToUpdate) {
      userToUpdate.roles = selectedRoles.map(roleId => availableRoles.find(role => role.id === roleId)).filter((role): role is Role => role !== undefined);
  
      try {
        const updatedUser = await updateUser(userId, userToUpdate, token);
        setUsers(users.map(user => user.id === userId ? updatedUser : user));
        setEditingUserId(null);
        setEditingUserData(null);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleDelete = async (userId: string) => {
    const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }
    const token = session.token;
    try {
      await deleteUser(userId, token);
      setUsers(users.map(user => user.id === userId ? { ...user, deleted: true } : user));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDisable = async (userId: string) => {
    const userToDisable = users.find(user => user.id === userId);
    const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }
    const token = session.token;
    if (userToDisable) {
      userToDisable.is_disabled = new Date().toISOString();
      try {
        const disabledUser = await updateUser(userId, userToDisable, token);
        setUsers(users.map(user => user.id === userId ? disabledUser : user));
      } catch (error) {
        console.error('Error disabling user:', error);
      }
    }
  };

  const handleEnable = async (userId: string) => {
    const userToEnable = users.find(user => user.id === userId);
    const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }
    const token = session.token;
    if (userToEnable) {
      userToEnable.is_disabled = null;
      try {
        const enabledUser = await updateUser(userId, userToEnable, token);
        setUsers(users.map(user => user.id === userId ? enabledUser : user));
      } catch (error) {
        console.error('Error enabling user:', error);
      }
    }
  };

  const handleCheckboxChange = (roleId: number) => {
    setSelectedRoles(prevSelectedRoles =>
      prevSelectedRoles.includes(roleId)
        ? prevSelectedRoles.filter(id => id !== roleId)
        : [...prevSelectedRoles, roleId]
    );
  };

  return (
    <div className='geist-sans-font bg-secondary'>
      <div className='table-container'>
      {!newUser && (
        <Button onClick={handleInsert} className="text-secondary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:bg-yellow-500 font-bold px-4 p-4 rounded mt-4 mx-4">
          + Insert New User
        </Button>
      )}
      <div className='m-4 rounded-2xl bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Is Disabled</TableHead>
            <TableHead>Deleted</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(users) && users.map(user =>(
            <TableRow key={user.id} className={user.deleted ? 'deleted' : ''}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
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
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
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
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
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
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
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
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
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
                {editingUserId === user.id ? (
                  Array.isArray(availableRoles) && availableRoles.map(role => (
                  <div className="role-label" key={role.id}>
                    <div className="checkbox-wrapper-26">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.id)}
                        onChange={() => handleCheckboxChange(role.id)}
                      />
                      <label htmlFor={`role-${role.id}-new`}>
                        <div className="tick_mark"></div>
                      </label>
                    </div>
                    <span className="role-name">{role.name}</span>
                  </div>
                  ))
                ) : (
                  user.roles?.map(role => (
                  <Badge key={role.id} className="m-1 text-secondary">
                    {role.name.replace('ROLE_', '')}
                  </Badge>
                  ))
                )}
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
                  <div className="role-label" key={role.id}>
                  <div className="checkbox-wrapper-26">
                    <input
                    type="checkbox"
                    id={`role-${role.id}-new`}
                    checked={newUser?.roles.some(r => r.id === role.id) || false}
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