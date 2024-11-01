"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSession } from 'next-auth/react';

interface Role {
  id: string;
  name: string;
  }
  
  interface User {
    id: string;
    name: string;
    lastname: string;
    username: string;
    email: string;
    phone: string;
    is_disabled: boolean;
    deleted?: boolean;
    roles: Role[];
  }
  
  interface Driver {
    id: string;
    licenseId: string;
    rating: string;
    isAvailable: boolean;
  }
  
  const ABMDriver: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [combinedData, setCombinedData] = useState<(Driver & User)[]>([]);
    const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
    const [newDriver, setNewDriver] = useState<Driver | null>(null);
  
    useEffect(() => {
      const fetchDriversAndUsers = async () => {
        try {
          const session = await getSession();
          if (!session) {
            console.error('No session found');
            return;
          }
  
          const token = session.user.token;
  
          const [driversResponse, usersResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

          if (!driversResponse.ok || !usersResponse.ok) {
            throw new Error('Failed to fetch data');
          }
  
          const driversData = await driversResponse.json();
          const usersData = await usersResponse.json();

          if (!Array.isArray(driversData.content) || !Array.isArray(usersData.content)) {
            throw new Error('Expected an array of drivers and users');
          }
  
          setDrivers(driversData.content);
        setUsers(usersData.content);
  
          // Combinar los datos de drivers y users
          const combined = driversData.content.map((driver: Driver) => {
            const user = usersData.content.find((user: User) => user.id === driver.id);
            return { ...driver, ...user };
          });
  
          setCombinedData(combined);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchDriversAndUsers();
    }, []);

  

  

  

    const handleSaveNewDriver = async () => {
      try {
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }
  
        const token = session.user.token;
  
        // Obtener el ID del usuario basado en el user_id
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${newDriver?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user');
        }
  
        const userData = await userResponse.json();
        if (!userData || !userData.id) {
          throw new Error('User not found');
        }
  
        const driverToSave = { ...newDriver, userId: userData.id };
        console.log('driverToSave:', driverToSave);
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(driverToSave),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to save new driver: ${errorData.message}`);
        }
  
        const savedDriver = await response.json();

        const roleResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userData.id}/roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: 'role_driver' }),
        });
  
        if (!roleResponse.ok) {
          const errorData = await roleResponse.json();
          throw new Error(`Failed to assign role: ${errorData.message}`);
        }

        setDrivers(prevDrivers => [...prevDrivers, savedDriver]);
  
        // Combinar el nuevo driver con los datos del usuario
        const combined = { ...savedDriver, ...userData };
        setCombinedData(prevCombinedData => [...prevCombinedData, combined]);
  
        setNewDriver(null);
      } catch (error) {
        console.error('Error saving new driver:', error);
        // Ignorar el error y continuar
        setNewDriver(null);
      }
    };




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string | null) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    if (id) {
      setDrivers(prevDrivers =>
        prevDrivers.map(driver =>
          driver.id === id ? { ...driver, [name]: inputValue } : driver
        )
      );
    } else {
      setNewDriver(prevNewDriver => (prevNewDriver ? { ...prevNewDriver, [name]: inputValue } : null));
    }
  };

  

  const handleInsert = () => {
    setNewDriver({
      id: '',
      licenseId: '',
      rating: '5',
      isAvailable: false,
    });
  };

  

  const handleEdit = (driverId: string) => {
    setEditingDriverId(driverId);
  };

  const handleSaveEdit = async (driverId: string) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.user.token;

    const driverToUpdate = drivers.find(driver => driver.id === driverId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${driverId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driverToUpdate),
      });
      const updatedDriver = await response.json();
      setDrivers(drivers.map(driver => driver.id === driverId ? updatedDriver : driver));
      setEditingDriverId(null);
    } catch (error) {
      console.error('Error updating driver:', error);
    }
  };

  const handleDelete = async (driverId: string) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.user.token;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${driverId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setDrivers(drivers.map(driver => driver.id === driverId ? { ...driver, deleted: true } : driver));
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  const handleEnable = async (driverId: string) => {
    try {
      const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }

      const token = session.user.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${driverId}/enable`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_disabled: null }),
      });

      if (!response.ok) {
        throw new Error('Failed to enable driver');
      }

      const updatedDriver = await response.json();
      setDrivers(drivers.map(driver => driver.id === driverId ? updatedDriver : driver));
    } catch (error) {
      console.error('Error enabling driver:', error);
    }
  };

  const handleDisable = async (driverId: string) => {
    try {
      const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }

      const token = session.user.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${driverId}/disable`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_disabled: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to disable driver');
      }

      const updatedDriver = await response.json();
      setDrivers(drivers.map(driver => driver.id === driverId ? updatedDriver : driver));
    } catch (error) {
      console.error('Error disabling driver:', error);
    }
  };

  const handleCancelNewDriver = () => {
    setNewDriver(null);
  };

  return (
    <StyledWrapper>
      <div className="table-container">
        <button onClick={handleInsert} className="bg-blue-500 m-1 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Insert New Driver
        </button>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>License Id</th>
              <th>Rating</th>
              <th>Is Available</th>
              <th>Is Disabled</th>
              <th>Deleted</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((data) => (
              <tr key={data.id} className={data.deleted ? 'deleted' : ''}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.lastname}</td>
                <td>{data.username}</td>
                <td>{data.email}</td>
                <td>{data.phone}</td>
                <td>{data.licenseId}</td>
                <td>{data.rating}</td>
                <td>{data.isAvailable ? 'Yes' : 'No'}</td>
                <td>{data.is_disabled ? 'Yes' : 'No'}</td>
                <td>{data.deleted ? 'Yes' : 'No'}</td>
                <td>{data.roles?.map(role => role.name).join(', ')}</td>
                <td>
                {editingDriverId === data.id ? (
                  <button onClick={() => handleSaveEdit(data.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Save</button>
                ) : (
                  <button onClick={() => handleEdit(data.id)} className="bg-blue-500 m-1 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Edit</button>
                )}
                <button onClick={() => handleDelete(data.id)} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Delete</button>
                {data.is_disabled ? (
                  <button onClick={() => handleEnable(data.id)} className='bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded'>Enable</button>
                ) : (
                  <button onClick={() => handleDisable(data.id)} className="bg-orange-500 m-1 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Disable</button>
                )}
              </td>
              </tr>
            ))}
            {newDriver && (
              <tr>
                <td>
                  <input
                    type="text"
                    id={`user_id-new`}
                    name="id"
                    value={newDriver.id}
                    onChange={(e) => handleInputChange(e, null)}
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                    placeholder="User ID"
                  />
                </td>
                <td colSpan={5}></td> {/* Espacio para los campos del usuario */}
                <td>
                  <input
                    type="text"
                    id={`licenseId-new`}
                    name="licenseId"
                    value={newDriver.licenseId}
                    onChange={(e) => handleInputChange(e, null)}
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                    placeholder="License ID"
                  />
                </td>
                <td colSpan={1}></td>
                <td>
                  <StyledCheckbox>
                    <div className="checkbox-wrapper-26">
                      <input
                        type="checkbox"
                        id={`isAvailable-new`}
                        name="isAvailable"
                        checked={newDriver.isAvailable}
                        onChange={(e) => handleInputChange(e, null)}
                      />
                      <label htmlFor={`isAvailable-new`}>
                        <div className="tick_mark"></div>
                      </label>
                    </div>
                  </StyledCheckbox>
                </td>
                <td colSpan={4}>
                  <button onClick={handleSaveNewDriver} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Save</button>
                  <button onClick={handleCancelNewDriver} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Cancel</button>
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

export default ABMDriver;