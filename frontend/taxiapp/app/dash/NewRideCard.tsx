"use client";

import { z } from "zod";
import AsyncSearchUserBox from "@/components/AsyncSearchUserBox/AsyncSearchUserBox";

import { Button } from "@nextui-org/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker, Switch, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { parseAbsoluteToLocal, DateValue, now } from "@internationalized/date";
import AsyncSearchDirectionBox from "@/components/AsyncSearchDirectionBox/AsyncSearchDirectionBox";
import { useMutation } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

type CreateRideRequest = {
  userId: string;
  pickupLocation: string;
  dropoffLocation: string;
  isBooked: boolean;
  rideStart?: string; // Cambiado a string, ya que es lo que el backend espera
  comments: string;
};

const NewRideCard = () => {


  const [formKey, setFormKey] = useState(0);

  const [formData, setFormData] = useState<{
    userId: React.Key | null;
    pickupLocation: React.Key | null;
    dropoffLocation: React.Key | null;
    isBooked: boolean;
    rideStart: DateValue | null;
    comments: string;
  }>({
    userId: null,
    pickupLocation: null,
    dropoffLocation: null,
    isBooked: false,
    rideStart: null,
    comments: "",
  });


  
  const [errors, setErrors] = useState<{ userId?: string; pickupLocation?: string; dropoffLocation?: string; rideStart?: string }>({});

  const mutation = useMutation({
    mutationFn: async ({ createRideRequest }: { createRideRequest: CreateRideRequest }) => {
      const session = await getSession();
      if (!session) {
        console.error("No session found");
        return;
      }
      const token = session.token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createRideRequest),
      });
      return response.json();
    },
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { userId?: string; pickupLocation?: string; dropoffLocation?: string; rideStart?: string } = {};

    if (!formData.userId) {
      newErrors.userId = "El usuario es obligatorio.";
    }
    if (!formData.pickupLocation) {
      newErrors.pickupLocation = "El origen es obligatorio.";
    }
    if (!formData.dropoffLocation) {
      newErrors.dropoffLocation = "El destino es obligatorio.";
    }
    if (formData.isBooked) {
      if (!formData.rideStart) {
        newErrors.rideStart = "La fecha de inicio es obligatoria si el viaje está programado.";
      } else if (formData.rideStart < now("America/Argentina/Buenos_Aires")) {
        newErrors.rideStart = "La fecha de inicio no puede ser en el pasado.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (formData.rideStart) {
      // Preparar el objeto para enviar al backend
      const rideRequest: CreateRideRequest = {
        userId: formData.userId as string,
        pickupLocation: formData.pickupLocation as string,
        dropoffLocation: formData.dropoffLocation as string,
        isBooked: formData.isBooked,
        comments: formData.comments,
        rideStart: formData.rideStart?.toString(),

      };
      toast.promise(mutation.mutateAsync({ createRideRequest: rideRequest }), {
        loading: "Creando viaje...",
        success: () =>{
          setFormData({
            userId: null,
            pickupLocation: null,
            dropoffLocation: null,
            isBooked: false,
            rideStart: null,
            comments: "",
          });
          setFormKey((prev) => prev + 1)
          return "Viaje creado";
        },
        error: "Error al crear viaje",
      });


      
    }else{
      const rideRequest: CreateRideRequest = {
        userId: formData.userId as string,
        pickupLocation: formData.pickupLocation as string,
        dropoffLocation: formData.dropoffLocation as string,
        isBooked: formData.isBooked,
        comments: formData.comments,
      };
      toast.promise(mutation.mutateAsync({ createRideRequest: rideRequest }), {
        loading: "Creando viaje...",
        success: () =>{
          setFormData({
            userId: null,
            pickupLocation: null,
            dropoffLocation: null,
            isBooked: false,
            rideStart: null,
            comments: "",
          });
          setFormKey((prev) => prev + 1)
          
          return "Viaje creado";
        },
        error: "Error al crear viaje",
      });
    }


  };

  return ( 
    <Card className="col-span-1 overflow-x-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Crear viaje</CardTitle>
      </CardHeader>
      <CardContent>
        <form key={formKey} onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div>
            <AsyncSearchUserBox onSelectionChange={(key) => handleChange("userId", key)} />
            {errors.userId && <p className="text-red-500 text-sm">{errors.userId}</p>}
          </div>
          <div>
            <AsyncSearchDirectionBox text="Origen" onSelectionChange={(key) => handleChange("pickupLocation", key)} />
            {errors.pickupLocation && <p className="text-red-500 text-sm">{errors.pickupLocation}</p>}
          </div>
          <div>
            <AsyncSearchDirectionBox text="Destino" onSelectionChange={(key) => handleChange("dropoffLocation", key)} />
            {errors.dropoffLocation && <p className="text-red-500 text-sm">{errors.dropoffLocation}</p>}
          </div>
          <div>
            <Switch isSelected={formData.isBooked} onValueChange={(value) => handleChange("isBooked", value)}>
              <span>Programar</span>
            </Switch>
            {formData.isBooked && (
              <div>
                <DatePicker
                  className="max-w"
                  variant="underlined"
                  granularity="minute"
                  
                  label="Fecha de inicio"
                  onChange={(newDate) => handleChange("rideStart", newDate)}
                />
                {errors.rideStart && <p className="text-red-500 text-sm">{errors.rideStart}</p>}
              </div>
            )}
          </div>
          <div>
            <Textarea
              label="Comentarios"
              placeholder="Comentarios adicionales..."
              variant="underlined"
              value={formData.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
            />
          </div>
          <Button variant="flat" type="submit" isLoading={mutation.isPending}>
            Crear viaje
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewRideCard;
