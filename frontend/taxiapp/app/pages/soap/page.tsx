"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';

interface Vehicle {
    brand: string;
    model: string;
    color: string;
}

const Vehiculos: React.FC = () => {
    const [action, setAction] = useState<string>('listVehicles');
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchResults, setSearchResults] = useState<Vehicle[]>([]);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const xmlRequest = generateXmlRequest(action, formData);
            const res = await axios.post('http://localhost:8081/ws', xmlRequest, {
                headers: {
                    'Content-Type': 'text/xml',
                },
            });
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(res.data, 'application/xml');
            if (action === 'addVehicle') {
                fetchVehicles();
            } else if (action === 'searchVehicleByBrand') {
                const vehicles = Array.from(xmlDoc.getElementsByTagName('ns2:vehicles')).map(vehicle => ({
                    brand: vehicle.getElementsByTagName('ns2:brand')[0]?.textContent || 'Unknown',
                    model: vehicle.getElementsByTagName('ns2:model')[0]?.textContent || 'Unknown',
                    color: vehicle.getElementsByTagName('ns2:color')[0]?.textContent || 'Unknown',
                }));
                setSearchResults(vehicles);
            }
        } catch (error) {
            console.error('Network Error:', error);
        }
    };

    const fetchVehicles = async () => {
        try {
            const xmlRequest = generateXmlRequest('listVehicles', {});
            const res = await axios.post('http://localhost:8081/ws', xmlRequest, {
                headers: {
                    'Content-Type': 'text/xml',
                },
            });
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(res.data, 'application/xml');
            const vehicles = Array.from(xmlDoc.getElementsByTagName('ns2:vehicles')).map(vehicle => ({
                brand: vehicle.getElementsByTagName('ns2:brand')[0]?.textContent || 'Unknown',
                model: vehicle.getElementsByTagName('ns2:model')[0]?.textContent || 'Unknown',
                color: vehicle.getElementsByTagName('ns2:color')[0]?.textContent || 'Unknown',
            }));
            setVehicles(vehicles);
        } catch (error) {
            console.error('Network Error:', error);
        }
    };

    const generateXmlRequest = (action: string, data: { [key: string]: string }): string => {
        if (action === 'addVehicle') {
            return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://springbootsoap.com/soap">
                <soapenv:Header/>
                <soapenv:Body>
                    <web:addVehicleRequest>
                        <web:vehicle>
                            <web:brand>${data.brand}</web:brand>
                            <web:model>${data.model}</web:model>
                            <web:color>${data.color}</web:color>
                        </web:vehicle>
                    </web:addVehicleRequest>
                </soapenv:Body>
            </soapenv:Envelope>`;
        } else if (action === 'searchVehicleByBrand') {
            return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://springbootsoap.com/soap">
                <soapenv:Header/>
                <soapenv:Body>
                    <web:searchVehicleByBrandRequest>
                        <web:brand>${data.brand}</web:brand>
                    </web:searchVehicleByBrandRequest>
                </soapenv:Body>
            </soapenv:Envelope>`;
        } else if (action === 'listVehicles') {
            return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://springbootsoap.com/soap">
                <soapenv:Header/>
                <soapenv:Body>
                    <web:listVehiclesRequest/>
                </soapenv:Body>
            </soapenv:Envelope>`;
        }
        return '';
    };

    return (
        <section className="bg-gray-900 bg-no-repeat bg-cover min-h-screen flex items-center justify-center">
            <div className="w-full max-w-4xl bg-slate-700 shadow sm:max-w-md xl:p-0 rounded-lg overflow-hidden">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                        Vehículos multados
                    </h1>
                    <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Brand</th>
                            <th className="py-3 px-4 text-left">Model</th>
                            <th className="py-3 px-4 text-left">Color</th>
                        </tr>
                        </thead>
                        <tbody>
                        {vehicles.map((vehicle, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100 text-black">
                                <td className="py-3 px-4">{vehicle.brand}</td>
                                <td className="py-3 px-4">{vehicle.model}</td>
                                <td className="py-3 px-4">{vehicle.color}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <select onChange={(e) => setAction(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                        <option>Seleccionar</option>
                        <option value="addVehicle">Agregar Vehículo</option>
                        <option value="searchVehicleByBrand">Buscar Vehículo por Marca</option>
                    </select>

                    {action === 'addVehicle' && (
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <input name="brand" placeholder="Marca" onChange={handleChange}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>
                            <input name="model" placeholder="Modelo" onChange={handleChange}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>
                            <input name="color" placeholder="Color" onChange={handleChange}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>
                            <button type="submit"
                                    className="w-full text-black bg-green-600 duration-150 hover:bg-green-700 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700">Enviar
                            </button>
                        </form>
                    )}

                    {action === 'searchVehicleByBrand' && (
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <input name="brand" placeholder="Marca" onChange={handleChange}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>
                            <button type="submit"
                                    className="w-full text-black bg-green-600 duration-150 hover:bg-green-700 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700">Buscar
                            </button>
                        </form>
                    )}

                    {searchResults.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                                Resultados de la búsqueda
                            </h2>
                            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                                <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">Brand</th>
                                    <th className="py-3 px-4 text-left">Model</th>
                                    <th className="py-3 px-4 text-left">Color</th>
                                </tr>
                                </thead>
                                <tbody>
                                {searchResults.map((vehicle, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-100 text-black">
                                        <td className="py-3 px-4">{vehicle.brand}</td>
                                        <td className="py-3 px-4">{vehicle.model}</td>
                                        <td className="py-3 px-4">{vehicle.color}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Vehiculos;