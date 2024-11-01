"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSession } from 'next-auth/react'; // Importar getSession desde next-auth/react


interface Driver {
  id: number;
  name: string;
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  color: string;
  details: string;
  is_disabled: string | null;
  deleted: boolean;
  year: number;
  license_plate: string;
  driver: Driver | null;
}

const ABMVehicle: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [newVehicle, setNewVehicle] = useState<Vehicle | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    // Realizar la solicitud al backend para obtener los vehículos
    const fetchVehicles = async () => {
      try {
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }

        const token = session.user.token;
        console.log('Token:', token);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setVehicles(data.content);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    // Realizar la solicitud al backend para obtener los conductores disponibles
    const fetchDrivers = async () => {
      try {
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }

        const token = session.user.token;
        console.log('Token:', token);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setAvailableDrivers(data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchVehicles();
    fetchDrivers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, vehicleId: number | null) => {
    const { name, value } = e.target;
    if (vehicleId === null) {
      setNewVehicle({ ...newVehicle!, [name]: value });
    } else {
      setVehicles(vehicles.map(vehicle => vehicle.id === vehicleId ? { ...vehicle, [name]: value } : vehicle));
    }
  };

  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>, vehicleId: number | null) => {
    const driverId = parseInt(e.target.value);
    const selectedDriver = availableDrivers.find(driver => driver.id === driverId) || null;
    if (vehicleId === null) {
      setNewVehicle({ ...newVehicle!, driver: selectedDriver });
    } else {
      setVehicles(vehicles.map(vehicle => vehicle.id === vehicleId ? { ...vehicle, driver: selectedDriver } : vehicle));
    }
  };

  const handleInsert = () => {
    setNewVehicle({
      id: 0,
      brand: '',
      model: '',
      color: '',
      details: '',
      is_disabled: null,
      deleted: false,
      year: new Date().getFullYear(),
      license_plate: '',
      driver: null
    });
  };

  const handleSaveNewVehicle = async () => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.user.token;

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

    const token = session.user.token;

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
      setVehicles(vehicles.map(vehicle => vehicle.id === vehicleId ? updatedVehicle : vehicle));
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

    const token = session.user.token;

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

    const token = session.user.token;

    const vehicleToDisable = vehicles.find(vehicle => vehicle.id === vehicleId);
    if (vehicleToDisable) {
      vehicleToDisable.is_disabled = new Date().toISOString();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_disabled: vehicleToDisable.is_disabled }), // Asegúrate de enviar solo el campo que deseas actualizar
        });
        const updatedVehicle = await response.json();
        setVehicles(vehicles.map(vehicle => vehicle.id === vehicleId ? updatedVehicle : vehicle));
      } catch (error) {
        console.error('Error disabling vehicle:', error);
      }
    }
  };

  const handleEnable = async (vehicleId: number) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.user.token;

    const vehicleToEnable = vehicles.find(vehicle => vehicle.id === vehicleId);
    if (vehicleToEnable) {
      vehicleToEnable.is_disabled = null;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_disabled: vehicleToEnable.is_disabled }), // Asegúrate de enviar solo el campo que deseas actualizar
        });
        const updatedVehicle = await response.json();
        setVehicles(vehicles.map(vehicle => vehicle.id === vehicleId ? updatedVehicle : vehicle));
      } catch (error) {
        console.error('Error enabling vehicle:', error);
      }
    }
  };

  return (
    <StyledWrapper>
    <div className='table-container'>
      <table className="styled-table">
        <thead>
          <tr>
            <th className="py-2">Id</th>
            <th className="py-2">Brand</th>
            <th className="py-2">Model</th>
            <th className="py-2">Color</th>
            <th className="py-2">Details</th>
            <th className="py-2">Year</th>
            <th className="py-2">License Plate</th>
            <th className="py-2">Driver</th>
            <th className="py-2">Is Disabled</th>
            <th className="py-2">Deleted</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles?.map(vehicle => (
            <tr key={vehicle.id} className={vehicle.deleted ? 'bg-red-100' : ''}>
              <td className="border px-4 py-2">{vehicle.id}</td>
              <td className="border px-4 py-2">
                {editingVehicleId === vehicle.id ? (
                  <input
                    type="text"
                    name="brand"
                    value={vehicle.brand}
                    onChange={(e) => handleInputChange(e, vehicle.id)}
                  />
                ) : (
                  vehicle.brand
                )}
              </td>
              <td className="border px-4 py-2">
                {editingVehicleId === vehicle.id ? (
                  <input
                    type="text"
                    name="model"
                    value={vehicle.model}
                    onChange={(e) => handleInputChange(e, vehicle.id)}
                  />
                ) : (
                  vehicle.model
                )}
              </td>
              <td className="border px-4 py-2">
                {editingVehicleId === vehicle.id ? (
                  <input
                    type="text"
                    name="color"
                    value={vehicle.color}
                    onChange={(e) => handleInputChange(e, vehicle.id)}
                  />
                ) : (
                  vehicle.color
                )}
              </td>
              <td className="border px-4 py-2">
                {editingVehicleId === vehicle.id ? (
                  <input
                    type="text"
                    name="details"
                    value={vehicle.details}
                    onChange={(e) => handleInputChange(e, vehicle.id)}
                  />
                ) : (
                  vehicle.details
                )}
              </td>
              <td className="border px-4 py-2">
                {editingVehicleId === vehicle.id ? (
                  <input
                    type="number"
                    name="year"
                    value={vehicle.year}
                    onChange={(e) => handleInputChange(e, vehicle.id)}
                  />
                ) : (
                  vehicle.year
                )}
              </td>
              <td className="border px-4 py-2">
                {editingVehicleId === vehicle.id ? (
                  <input
                    type="text"
                    name="license_plate"
                    value={vehicle.license_plate}
                    onChange={(e) => handleInputChange(e, vehicle.id)}
                  />
                ) : (
                  vehicle.license_plate
                )}
              </td>
              <td className="border px-4 py-2">
                {editingVehicleId === vehicle.id ? (
                  <select
                    name="driver"
                    value={vehicle.driver?.id || ''}
                    onChange={(e) => handleDriverChange(e, vehicle.id)}
                  >
                    <option value="">Select Driver</option>
                    {Array.isArray(availableDrivers) && availableDrivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                            {driver.name}
                        </option>
                    ))}
                  </select>
                ) : (
                  vehicle.driver?.name || 'No Driver'
                )}
              </td>
              <td className="border px-4 py-2">{vehicle.is_disabled}</td>
              <td className="border px-4 py-2">{vehicle.deleted ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">
                {editingVehicleId === vehicle.id ? (
                  <button onClick={() => handleSaveEdit(vehicle.id)} className="btn btn-save">
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEdit(vehicle.id)} className="btn btn-edit">
                    Edit
                  </button>
                )}
                <button onClick={() => handleDelete(vehicle.id)} className="btn btn-delete">
                  Delete
                </button>
                {vehicle.is_disabled ? (
                  <button onClick={() => handleEnable(vehicle.id)} className="btn btn-enable">
                    Enable
                  </button>
                ) : (
                  <button onClick={() => handleDisable(vehicle.id)} className="btn btn-disable">
                    Disable
                  </button>
                )}
              </td>
            </tr>
          ))}
          {newVehicle && (
            <tr>
              <td className="border px-4 py-2">{newVehicle.id}</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="brand"
                  value={newVehicle.brand}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="model"
                  value={newVehicle.model}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="color"
                  value={newVehicle.color}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="details"
                  value={newVehicle.details}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  name="year"
                  value={newVehicle.year}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="license_plate"
                  value={newVehicle.license_plate}
                  onChange={(e) => handleInputChange(e, null)}
                />
              </td>
              <td className="border px-4 py-2">
                <select
                  name="driver"
                  value={newVehicle.driver?.id || ''}
                  onChange={(e) => handleDriverChange(e, null)}
                >
                  <option value="">Select Driver</option>
                  {Array.isArray(availableDrivers) && availableDrivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border px-4 py-2">{newVehicle.is_disabled}</td>
              <td className="border px-4 py-2">{newVehicle.deleted ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">
                <button onClick={handleSaveNewVehicle} className="btn btn-save">
                  Send
                </button>
                <button onClick={handleCancelNewVehicle} className="btn btn-cancel">
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!newVehicle && (
        <button onClick={handleInsert} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Insert New Vehicle
        </button>
      )}
    </div>
    </StyledWrapper>
  );
};

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
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn-edit {
    @apply bg-blue-500 hover:bg-blue-700;
  }

  .btn-delete {
    @apply bg-red-500 hover:bg-red-700;
  }

  .btn-disable {
    @apply bg-orange-500 hover:bg-orange-700;
  }

  .btn-save {
    @apply bg-green-500 hover:bg-green-700;
  }

  .btn-cancel {
    @apply bg-gray-500 hover:bg-gray-700;
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

export default ABMVehicle;