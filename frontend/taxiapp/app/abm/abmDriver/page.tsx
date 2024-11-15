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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { user } from '@nextui-org/theme';


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
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [editingDriverData, setEditingDriverData] = useState<Driver | null>(null);
    const [newDriver, setNewDriver] = useState<Driver | null>(null);
  
    useEffect(() => {
      const fetchDriversAndUsers = async () => {
        try {
          const session = await getSession();
          if (!session) {
            console.error('No session found');
            return;
          }
  
          const token = session.token;
  
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
  
        const token = session.token;
  
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
      } else if (editingDriverId) {
        setEditingDriverData(prevDriver => (prevDriver ? { ...prevDriver, [name]: inputValue } : null));
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
    const driverToEdit = drivers.find(driver => driver.id === driverId);
    if (driverToEdit) {
      setEditingDriverId(driverId);
      setDrivers(prevDrivers =>
        prevDrivers.map(driver =>
          driver.id === driverId ? { ...driver, isAvailable: driverToEdit.isAvailable } : driver
        )
      );
    }
  };

  const handleSaveEdit = async (driverId: string) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }
  
    const token = session.token;
  
    const driverToUpdate = drivers.find(driver => driver.id === driverId);
    if (driverToUpdate) {
      const updatedDriverData = {
        userId: driverToUpdate.id,
        isAvailable: driverToUpdate.isAvailable,
        licenseId: driverToUpdate.licenseId,
      };
  
      console.log('updatedDriverData:', updatedDriverData);
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${driverId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDriverData),
        });
        const updatedDriver = await response.json();
        setDrivers(drivers.map(driver => driver.id === driverId ? updatedDriver : driver));
        setEditingDriverId(null);
      } catch (error) {
        console.error('Error updating driver:', error);
      }
    }
  };

  const handleDelete = async (driverId: string) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.token;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${driverId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setDrivers(drivers.map(driver => driver.id === driverId ? { ...driver, deleted: true } : driver));
      setSelectedDriverId(null);
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

      const token = session.token;

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

      const token = session.token;

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

  const handleCancelEdit = () => {
    setEditingDriverId(null);
  };

  const handleCancelNewDriver = () => {
    setNewDriver(null);
  };

  return (
    <div className='geist-sans-font bg-secondary'>
      <div className='table-container'>
      {!newDriver && (
        <Button onClick={handleInsert} className="text-secondary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:bg-yellow-500 font-bold px-4 p-4 rounded m-4">
          + Insert New Driver
        </Button>
      )}
      <div className='mx-4 rounded-2xl bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
      <Table>
        <TableHeader className='text-black'>
          <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>License Id</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Is Available</TableHead>
              <TableHead>Is Disabled</TableHead>
              <TableHead>Deleted</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combinedData.map((data) => (
              <TableRow key={data.id} className={data.deleted ? 'deleted' : ''}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.lastname}</TableCell>
                <TableCell>{data.username}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.phone}</TableCell>
                <TableCell>
                  {editingDriverId === data.id ? (
                    <input
                      className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                      type="text"
                      name="licenseId"
                      defaultValue={data.licenseId}
                      onChange={(e) => handleInputChange(e, data.id)}
                    />
                  ) : (
                    data.licenseId
                  )}
                </TableCell>
                <TableCell>{data.rating}</TableCell>
                <TableCell>
                  {editingDriverId === data.id ? (
                    <input
                      type="checkbox"
                      name="isAvailable"
                      defaultChecked={data.isAvailable}
                      onChange={(e) => handleInputChange(e, data.id)}
                    />
                  ) : (
                    data.isAvailable ? 'Yes' : 'No'
                  )}
                </TableCell>
                <TableCell>{data.is_disabled ? 'Yes' : 'No'}</TableCell>
                <TableCell>{data.deleted ? 'Yes' : 'No'}</TableCell>
                <TableCell>{data.roles?.map(role => (
                  <Badge key={role.id} className="m-1 text-secondary">
                    {role.name.replace('ROLE_', '')}
                  </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  {editingDriverId === data.id ? (
                    <>
                      <Button onClick={() => handleSaveEdit(data.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Save</Button>
                      <Button onClick={handleCancelEdit} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(data.id)} className="bg-blue-500 m-1 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button onClick={() => setSelectedDriverId(data.id)} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente al driver.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className='bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary'>Cancelar</AlertDialogCancel>
                            <AlertDialogAction className='bg-destructive hover:bg-red-600' onClick={() => selectedDriverId && handleDelete(selectedDriverId)}>Confirmar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {data.is_disabled ? (
                        <Button onClick={() => handleEnable(data.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Enable</Button>
                      ) : (
                        <Button onClick={() => handleDisable(data.id)} className="bg-orange-500 m-1 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Disable</Button>
                      )}
                    </>
                  )}
                </TableCell>
            </TableRow>
            ))}
            {newDriver && (
              <TableRow>
                <TableCell>
                  <input
                    type="text"
                    id={`user_id-new`}
                    name="id"
                    value={newDriver.id}
                    onChange={(e) => handleInputChange(e, null)}
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                    placeholder="User ID"
                  />
                </TableCell>
                <TableCell colSpan={5}></TableCell> {/* Espacio para los campos del usuario */}
                <TableCell>
                  <input
                    type="text"
                    id={`licenseId-new`}
                    name="licenseId"
                    value={newDriver.licenseId}
                    onChange={(e) => handleInputChange(e, null)}
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                    placeholder="License ID"
                  />
                </TableCell>
                <TableCell colSpan={1}></TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell colSpan={4}>
                  <button onClick={handleSaveNewDriver} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Save</button>
                  <button onClick={handleCancelNewDriver} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Cancel</button>
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

export default ABMDriver;