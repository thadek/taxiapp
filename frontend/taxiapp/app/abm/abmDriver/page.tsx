"use client";
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { getUser, getUsers, updateUser, getDrivers, createDriver, updateDriver, deleteDriver } from '@/app/queries/abm';
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
    is_disabled: string | null;
    deleted?: boolean;
    roles: Role[];
  }
  
  interface Driver {
    id: string;
    licenseId: string;
    rating: string;
    isAvailable: boolean;
    is_disabled?: string | null;
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
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }
        const token = session.token;
        try {
          const driversData = await getDrivers(token);
          const usersData = await getUsers(token);
          
          setDrivers(driversData.content);
          setUsers(usersData.content);
          console.log('driversData:', driversData);
    
          const combined = driversData.content.map((driver: Driver) => {
            const user = usersData.content.find((user: User) => user.id === driver.id);
            return { ...driver, ...user };
          });
    
          setCombinedData(combined);
          console.log('combined:', combined);
    
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchDriversAndUsers();
    }, []);

    const handleSaveNewDriver = async () => {
      const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }
      const token = session.token;
      try {
        // Obtener el ID del usuario basado en el user_id
        if (!newDriver?.id) {
          throw new Error('Driver ID is undefined');
        }
    
        const newDriverData = {
          userId: newDriver.id,
          isAvailable: newDriver.isAvailable,
          licenseId: newDriver.licenseId,
          rating: "5"
        };
    
        const userData = await getUser(newDriver.id, token);
    
        try {
          const createdDriver = await createDriver(newDriverData, token);
          setDrivers((prevDrivers) => [...(Array.isArray(prevDrivers) ? prevDrivers : []), createdDriver]);
    
          const combined = [...(Array.isArray(combinedData) ? combinedData : []), { ...createdDriver, ...userData }];
          setCombinedData(combined);
        } catch (error) {
          if (error instanceof Error && error.message.includes("500")) {
            // Ignorar el error y proceder como si la operación hubiera sido exitosa
            const combined = [...(Array.isArray(combinedData) ? combinedData : []), { ...newDriverData, ...userData }];
            setCombinedData(combined);
            setDrivers((prevDrivers) => [...(Array.isArray(prevDrivers) ? prevDrivers : []), { ...newDriverData, id: newDriver.id }]);
          } else {
            setNewDriver(null);
            throw error;
          }
        }
    
        setNewDriver(null); // Oculta los inputs después de crear el driver
      } catch (error) {
        console.error('Error creating driver:', error);
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
      try {
        const response = await updateDriver(driverId, driverToUpdate, token);
        setDrivers(drivers.map(driver => driver.id === driverId ? response : driver));
  
        // Actualiza combinedData
        const combined = combinedData.map(data => {
          if (data.id === driverId) {
            return { ...data, ...response };
          }
          return data;
        });
        setCombinedData(combined);
  
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
      await deleteDriver(driverId, token);
      setDrivers(drivers.filter(driver => driver.id !== driverId));
      setCombinedData(combinedData.filter(data => data.id !== driverId));
      setSelectedDriverId(null);
    } catch (error) {
      console.error('Error deleting driver:', error);
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
  
        // Actualiza combinedData
        const combined = combinedData.map(data => {
          if (data.id === userId) {
            return { ...data, is_disabled: userToEnable.is_disabled };
          }
          return data;
        });
        setCombinedData(combined);
  
      } catch (error) {
        console.error('Error enabling user:', error);
      }
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
  
        // Actualiza combinedData
        const combined = combinedData.map(data => {
          if (data.id === userId) {
            return { ...data, is_disabled: userToDisable.is_disabled };
          }
          return data;
        });
        setCombinedData(combined);
  
      } catch (error) {
        console.error('Error disabling user:', error);
      }
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
          + Agregar nuevo conductor
        </Button>
      )}
      <div className='mx-4 rounded-2xl bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
      <Table>
        <TableHeader className='text-black'>
          <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>ID de Licencia</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Disponible</TableHead>
              <TableHead>Desactivado</TableHead>
              <TableHead>Eliminado</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(combinedData) && combinedData.map((data) => (
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
                    data.isAvailable ? 'Si' : 'No'
                  )}
                </TableCell>
                <TableCell>{data.is_disabled ? 'Si' : 'No'}</TableCell>
                <TableCell>{data.deleted ? 'Si' : 'No'}</TableCell>
                <TableCell>{data.roles?.map(role => (
                  <Badge key={role.id} className="m-1 text-secondary">
                    {role.name.replace('ROLE_', '')}
                  </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  {editingDriverId === data.id ? (
                    <>
                      <Button onClick={() => handleSaveEdit(data.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Guardar</Button>
                      <Button onClick={handleCancelEdit} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Cancelar</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(data.id)} className="bg-blue-500 m-1 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Editar</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button onClick={() => setSelectedDriverId(data.id)} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Eliminar</Button>
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
                        <Button onClick={() => handleEnable(data.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Activar</Button>
                      ) : (
                        <Button onClick={() => handleDisable(data.id)} className="bg-orange-500 m-1 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Desactivar</Button>
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