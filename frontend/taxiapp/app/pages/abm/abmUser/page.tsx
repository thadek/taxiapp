"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSession } from 'next-auth/react';


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
    <StyledWrapper>
      <div className='table-container'>
      {!newUser && (
        <button onClick={handleInsert} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Insert New User
        </button>
      )}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Is Disabled</th>
            <th>Deleted</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr key={user.id} className={user.deleted ? 'deleted' : ''}>
              <td>{user.id}</td>
              <td>
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
              </td>
              <td>
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
              </td>
              <td>
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
              </td>
              <td>
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
              </td>
              <td>
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
              </td>
              <td>{user.is_disabled}</td>
              <td>{user.deleted ? 'Yes' : 'No'}</td>
              <td>
                {user.roles?.map(role => role.name).join(', ')}
              </td>
              <td>
                  {editingUserId === user.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(user.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Save</button>
                      <button onClick={handleCancelEdit} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user.id)} className="bg-blue-500 m-1 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Delete</button>
                      {user.is_disabled ? (
                        <button onClick={() => handleEnable(user.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Enable</button>
                      ) : (
                        <button onClick={() => handleDisable(user.id)} className="bg-orange-500 m-1 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Disable</button>
                      )}
                    </>
                  )}
                </td>
            </tr>
          ))}
          {newUser && (
            <tr>
              <td>{newUser.id}</td>
              <td>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="Name"
                  name="name"
                  value={newUser.name}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td>
                <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="Last Name"
                  name="lastname"
                  value={newUser.lastname}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="Username"
                  name="username"
                  value={newUser.username}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td>
                <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" placeholder="E-mail"
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="+542991234567"
                  name="phone"
                  value={newUser.phone}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td>{newUser.is_disabled}</td>
              <td>{newUser.deleted ? 'Yes' : 'No'}</td>
              <td>
                {Array.isArray(availableRoles) && availableRoles.map(role => (
                  <StyledCheckbox key={role.id}>
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
                </StyledCheckbox>
                ))}
              </td>
              <td>
                <button onClick={handleSaveNewUser} className='bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded'>Send</button>
                <button onClick={handleCancelNewUser} className='bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded'>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </StyledWrapper>
  );
};

const StyledCheckbox = styled.div`
  .checkbox-wrapper-26 * {
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  .checkbox-wrapper-26 input[type="checkbox"] {
    display: none;
  }

  .checkbox-wrapper-26 label {
    --size: 20px; /* Ajusta el tamaño según sea necesario */
    --shadow: calc(var(--size) * .07) calc(var(--size) * .1);

    position: relative;
    display: block;
    width: var(--size);
    height: var(--size);
    margin: 0 auto;
    background-color: #f72414;
    border-radius: 50%;
    box-shadow: 0 var(--shadow) #ffbeb8;
    cursor: pointer;
    transition: 0.2s ease transform, 0.2s ease background-color,
      0.2s ease box-shadow;
    overflow: hidden;
    z-index: 1;
  }

  .checkbox-wrapper-26 label:before {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    width: calc(var(--size) * .7);
    height: calc(var(--size) * .7);
    margin: 0 auto;
    background-color: #fff;
    transform: translateY(-50%);
    border-radius: 50%;
    box-shadow: inset 0 var(--shadow) #ffbeb8;
    transition: 0.2s ease width, 0.2s ease height;
  }

  .checkbox-wrapper-26 label:hover:before {
    width: calc(var(--size) * .55);
    height: calc(var(--size) * .55);
    box-shadow: inset 0 var(--shadow) #ff9d96;
  }

  .checkbox-wrapper-26 label:active {
    transform: scale(0.9);
  }

  .checkbox-wrapper-26 .tick_mark {
    position: absolute;
    top: -1px;
    right: 0;
    left: calc(var(--size) * -.05);
    width: calc(var(--size) * .6);
    height: calc(var(--size) * .6);
    margin: 0 auto;
    margin-left: calc(var(--size) * .14);
    transform: rotateZ(-40deg);
  }

  .checkbox-wrapper-26 .tick_mark:before,
  .checkbox-wrapper-26 .tick_mark:after {
    content: "";
    position: absolute;
    background-color: #fff;
    border-radius: 2px;
    opacity: 0;
    transition: 0.2s ease transform, 0.2s ease opacity;
  }

  .checkbox-wrapper-26 .tick_mark:before {
    left: 0;
    bottom: 0;
    width: calc(var(--size) * .1);
    height: calc(var(--size) * .3);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.23);
    transform: translateY(calc(var(--size) * -.68));
  }

  .checkbox-wrapper-26 .tick_mark:after {
    left: 0;
    bottom: 0;
    width: 100%;
    height: calc(var(--size) * .1);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.23);
    transform: translateX(calc(var(--size) * .78));
  }

  .checkbox-wrapper-26 input[type="checkbox"]:checked + label {
    background-color: #07d410;
    box-shadow: 0 var(--shadow) #92ff97;
  }

  .checkbox-wrapper-26 input[type="checkbox"]:checked + label:before {
    width: 0;
    height: 0;
  }

  .checkbox-wrapper-26 input[type="checkbox"]:checked + label .tick_mark:before,
  .checkbox-wrapper-26 input[type="checkbox"]:checked + label .tick_mark:after {
    transform: translate(0);
    opacity: 1;
  }

  .role-label {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .role-name {
    margin-left: 8px; /* Espacio entre el checkbox y el nombre del rol */
  }
`;

const StyledWrapper = styled.div`
  font-family: 'Roboto', sans-serif;
  background-color: #2B2B2E;
  padding: 20px;
  display: flex;
  justify-content: center;

  
  .table-container {
    width: 95%;
    overflow-x: auto;
  }

  .styled-table {
    width: 100%;
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 18px;
    text-align: left;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
  }

  .styled-table th, .styled-table td {
    padding: 12px 15px;
  }

  .styled-table thead tr {
    background-color: #EAB308;
    color: #ffffff;
    text-align: left;
    font-weight: bold;
  }

  .styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  .styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

  .styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  .styled-table tbody tr.deleted {
    background-color: #f8d7da;
  }

  input[type="text"], input[type="email"], input[type="checkbox"] {
    padding: 8px;
    margin: 4px 0;
    box-sizing: border-box;
  }

  .btn {
    padding: 8px 16px;
    margin: 4px;
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn.edit {
    background-color: #007bff;
  }

  .btn.delete {
    background-color: #dc3545;
  }

  .btn.disable {
    background-color: #fd7e14;
  }

  .btn.save {
    background-color: #28a745;
  }

  .btn.cancel {
    background-color: #6c757d;
  }

  .btn:hover {
    opacity: 0.8;
  }

  label {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  label input[type="checkbox"] {
    margin-right: 5px;
  }
`;

export default ABMUser;