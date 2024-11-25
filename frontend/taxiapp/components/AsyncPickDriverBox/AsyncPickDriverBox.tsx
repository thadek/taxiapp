'use client'

import React from "react";
import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@/types/vehicle.type";
import { Label } from "../ui/label";
import { RefreshCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



export default function AsyncPickDriverBox({onSelectionChange, validationError}: { onSelectionChange: (key: React.Key | null) => void, validationError: string | null }) {
    const { data: session } = useSession();
    const backUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
    const { data, isSuccess, isLoading, error, refetch } = useQuery({
      queryKey: ['getAvailablesVehicles', session],
      queryFn: async () => {
        const response = await fetch(
          `${backUrl}/vehicles/by-status?statuses=AVAILABLE`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        return await response.json();
      },
    });
  
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      onSelectionChange(selectedValue === '' ? null : selectedValue);
    };
  
    const handleTriggerRefetch = () => {
      refetch();
    };
  
    if (isLoading) return <Spinner color="warning" size="lg" />;
    if (error) return <p className="text-red-500">Error loading vehicles</p>;
  
    return (
      isSuccess && (<div className="flex flex-col">
        <div className="flex gap-3">
          <div className="">
            <select
              className=" p-3 border text-xs rounded shadow focus:outline-none focus:ring-2 focus:ring-warning"
              defaultValue=""
              onChange={handleChange}
            >
              <option value="" disabled>
                Elegir auto disponible
              </option>
              {data?.content.map((vehicle: Vehicle) => ( vehicle.driver &&
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} - {vehicle.driver.name},{' '}
                  {vehicle.driver.lastname}
                </option>
              ))}
              {data?.content.length === 0 && (
                <option value="" disabled>
                  No hay autos disponibles
                  </option> 
                  )}
            </select>
          </div>
  
          <Button
            className=""
            variant="flat"
            color="warning"
            isIconOnly
            onClick={handleTriggerRefetch}
          >
            <RefreshCcw className="w-4 h-4"/>
          </Button>
        </div>
        {validationError && <span className="text-red-500 text-xs">{validationError}</span>}
        
        </div>
      )
    );
  }

