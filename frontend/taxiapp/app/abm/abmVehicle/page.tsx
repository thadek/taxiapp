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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select';


interface Driver {
  id: number;
  name: string;
  is_disabled: boolean;
}

interface Vehicle {
  id: number;
  driver: Driver;
  brand: string;
  model: string;
  color: string;
  details: string;
  isDisabled: string | null;
  deleted: boolean;
  year: number;
  licensePlate: string;
}

const ABMVehicle: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [editingVehicleData, setEditingVehicleData] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<Vehicle | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }
  
        const token = session.token;
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setVehicles(data.content);
        console.log('Vehicles:', data.content);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
  
    const fetchDrivers = async () => {
      try {
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }
  
        const token = session.token;
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setAvailableDrivers(Array.isArray(data.content) ? data.content : []);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
  
    fetchVehicles();
    fetchDrivers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string | null) => {
    const { name, value } = e.target;
    if (id) {
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle =>
          vehicle.id === Number(id) ? { ...vehicle, [name]: value } : vehicle
        )
      );
    } else {
      setNewVehicle(prevNewVehicle => (prevNewVehicle ? { ...prevNewVehicle, [name]: value } : null));
    }
  };

  const handleDriverChange = async (driverId: string, vehicleId: number) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }
  
    const token = session.token;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}/driver/${driverId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update driver');
      }
  
      const updatedVehicle = await response.json();
      setVehicles(vehicles.map(vehicle => vehicle.id === vehicleId ? updatedVehicle : vehicle));
    } catch (error) {
      console.error('Error updating driver:', error);
    }
  };

  const handleInsert = () => {
    setNewVehicle({
      id: 0,
      brand: '',
      model: '',
      color: '',
      details: '',
      isDisabled: null,
      deleted: false,
      year: new Date().getFullYear(),
      licensePlate: '',
      driver: {
        id: 0,
        name: '',
        is_disabled: false,
      },
    });
  };

  const handleSaveNewVehicle = async () => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.token;

    try {
        console.log('New Vehicle:', newVehicle);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVehicle),
      });
      const savedVehicle = await response.json();
      setVehicles([...vehicles, savedVehicle]);
      setNewVehicle(null);
    } catch (error) {
      console.error('Error saving new vehicle:', error);
    }
  };

  const handleCancelNewVehicle = () => {
    setNewVehicle(null);
  };

  const handleEdit = (vehicleId: number) => {
    setEditingVehicleId(vehicleId);
  };

  const handleSaveEdit = async (vehicleId: number) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.token;

    const vehicleToUpdate = vehicles.find(vehicle => vehicle.id === vehicleId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleToUpdate),
      });
      const updatedVehicle = await response.json();
      setVehicles(vehicles.map(vehicle => vehicle.id === Number(vehicleId) ? updatedVehicle : vehicle));
      setEditingVehicleId(null);
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const handleDelete = async (vehicleId: number) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.token;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setVehicles(vehicles.map(vehicle => vehicle.id === vehicleId ? { ...vehicle, deleted: true } : vehicle));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleDisable = async (vehicleId: number) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }
  
    const token = session.token;
  
    const vehicleToDisable = vehicles.find(vehicle => vehicle.id === vehicleId);
    if (vehicleToDisable) {
      vehicleToDisable.isDisabled = new Date().toISOString();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehicleToDisable),
        });
        const updatedVehicle = await response.json();
        setVehicles(vehicles.map(vehicle => vehicle.id === vehicleId ? updatedVehicle : vehicle));
      } catch (error) {
        console.error('Error disabling vehicle:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingVehicleId(null);
  };

  const handleEnable = async (vehicleId: number) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }
  
    const token = session.token;
  
    const vehicleToEnable = vehicles.find(vehicle => vehicle.id === vehicleId);
    if (vehicleToEnable) {
      vehicleToEnable.isDisabled = null;
      console.log('Vehicle to enable:', vehicleToEnable);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehicleToEnable),
        });
        const updatedVehicle = await response.json();
        console.log('Updated Vehicle:', updatedVehicle); // Verifica la respuesta del backend
        setVehicles(vehicles.map(vehicle => vehicle.id === vehicleId ? updatedVehicle : vehicle));
      } catch (error) {
        console.error('Error enabling vehicle:', error);
      }
    }
  };


  return (
    <div className='geist-sans-font bg-secondary'>
      <div className='table-container'>
      {!newVehicle && (
        <Button onClick={handleInsert} className="text-secondary bg-secondary-foreground shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:bg-yellow-500 font-bold px-4 p-4 rounded mt-4 mx-4">
          + Insert New Vehicle
        </Button>
      )}
      <div className='m-4 rounded-2xl bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Driver ID</TableHead>
            <TableHead>License Plate</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Disabled</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles?.map(vehicle => (
            <TableRow key={vehicle.id} className={vehicle.deleted ? 'deleted' : ''}>
              <TableCell>{vehicle.id}</TableCell>
              <TableCell>
                {editingVehicleId === vehicle.id ? (
                  <>
                    <Select onValueChange={(value) => handleDriverChange(value, vehicle.id)}>
                      <SelectTrigger className="w-full bg-gray-200 border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500">
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Drivers</SelectLabel>
                          <SelectItem value="none">No Driver</SelectItem>
                          {availableDrivers.map(driver => (
                            <SelectItem key={driver.id} value={driver.id.toString()}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  vehicle.driver ? vehicle.driver.id : 'N/A'
                )}
              </TableCell>
              <TableCell>
                {editingVehicleId === vehicle.id ? (
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                    type="text"
                    name="licensePlate"
                    placeholder="ABC123"
                    value={vehicle.licensePlate}
                    onChange={(e) => handleInputChange(e, vehicle.id.toString())}
                  />
                ) : (
                  vehicle.licensePlate
                )}
              </TableCell>
              <TableCell>
                {editingVehicleId === vehicle.id ? (
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                    type="text"
                    placeholder="Brand"
                    name="brand"
                    value={vehicle.brand}
                    onChange={(e) => handleInputChange(e, vehicle.id.toString())}
                  />
                ) : (
                  vehicle.brand
                )}
              </TableCell>
              <TableCell>
                {editingVehicleId === vehicle.id ? (
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                    type="text"
                    name="model"
                    placeholder="Model"
                    value={vehicle.model}
                    onChange={(e) => handleInputChange(e, vehicle.id.toString())}
                  />
                ) : (
                  vehicle.model
                )}
              </TableCell>
              <TableCell>
                {editingVehicleId === vehicle.id ? (
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                    type="text"
                    name="year"
                    placeholder="Year"
                    value={vehicle.year}
                    onChange={(e) => handleInputChange(e, vehicle.id.toString())}
                  />
                ) : (
                  vehicle.year
                )}
              </TableCell>
              <TableCell>
                {editingVehicleId === vehicle.id ? (
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                    type="text"
                    placeholder="Color"
                    name="color"
                    value={vehicle.color}
                    onChange={(e) => handleInputChange(e, vehicle.id.toString())}
                  />
                ) : (
                  vehicle.color
                )}
              </TableCell>
              <TableCell>
                {editingVehicleId === vehicle.id ? (
                  <Textarea
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                    name="details"
                    placeholder="Details"
                    value={vehicle.details}
                    onChange={(e) => handleInputChange(e, vehicle.id.toString())}
                  />
                ) : (
                  vehicle.details
                )}
              </TableCell>
              <TableCell>{vehicle.isDisabled}</TableCell>
              <TableCell>
                  {editingVehicleId === vehicle.id ? (
                    <>
                      <Button onClick={() => handleSaveEdit(vehicle.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Save</Button>
                      <Button onClick={handleCancelEdit} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(vehicle.id)} className="bg-blue-500 m-1 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Edit</Button>
                      <Button onClick={() => handleDelete(vehicle.id)} className="bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Delete</Button>
                      {vehicle.isDisabled ? (
                        <Button onClick={() => handleEnable(vehicle.id)} className="bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Enable</Button>
                      ) : (
                        <Button onClick={() => handleDisable(vehicle.id)} className="bg-orange-500 m-1 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Disable</Button>
                      )}
                    </>
                  )}
                </TableCell>
            </TableRow>
          ))}
          {newVehicle && (
            <TableRow>
              <TableCell colSpan={2}></TableCell>
              <TableCell>
                <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="License Plate"
                  name="licensePlate"
                  value={newVehicle.licensePlate}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" type="text" placeholder="Brand"
                  name="brand"
                  value={newVehicle.brand}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" placeholder="Model"
                  type="text"
                  name="model"
                  value={newVehicle.model}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" placeholder="Year"
                  type="text"
                  name="year"
                  value={newVehicle.year}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" placeholder="Color"
                  type="text"
                  name="color"
                  value={newVehicle.color}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>
                <Textarea
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                  id="inline-full-name" placeholder="Details"
                  name="details"
                  value={newVehicle.details}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </TableCell>
              <TableCell>{newVehicle.isDisabled}</TableCell>
              <TableCell>
                <button onClick={handleSaveNewVehicle} className='bg-green-500 m-1 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded'>Send</button>
                <button onClick={handleCancelNewVehicle} className='bg-red-500 m-1 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded'>Cancel</button>
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

export default ABMVehicle;