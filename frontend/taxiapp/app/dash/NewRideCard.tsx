"use client";

import { z } from "zod";
import AsyncSearchUserBox from "@/components/AsyncSearchUserBox/AsyncSearchUserBox";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker, Switch, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { parseAbsoluteToLocal,DateValue,now } from "@internationalized/date";
import AsyncSearchDirectionBox from "@/components/AsyncSearchDirectionBox/AsyncSearchDirectionBox";




const NewRideCard = ({ }) => {
    const [from, setOrigen] = useState<React.Key | null>(null)
    const [to, setDestino] = useState<React.Key | null>(null)
    const [isProgrammed, setIsProgrammed] = useState(false)
    const [date, setDate] = useState<DateValue>(parseAbsoluteToLocal("2021-04-07T18:45:22Z"));
  
  
    const onOriginSelectionChange = (key: React.Key | null) => {
      if (key === null) {
        return;
      }
      console.log(key);
      setOrigen(key)
    }
  
  
    const onDestinationSelectionChange = (key: React.Key | null) => {
      if (key === null) {
        return;
      }
      console.log(key);
      setDestino(key)
  
    }
  
    const onUserSelectionChange = (key: React.Key | null) => {
      if (key === null) {
        return;
      }
      console.log(key);
    }
  
    const handleSubmit = (e: any) => {
      e.preventDefault()
      //onNewTrip({ from, to, distance: `${(Math.random() * 10).toFixed(1)} miles` })
      console.log(from, to,)
  
    }
  
  
  
    return (
      <Card className="col-span-1 overflow-x-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Crear viaje</CardTitle>
  
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
  
            <div>
              <AsyncSearchUserBox onSelectionChange={onUserSelectionChange} />
            </div>
            <div>
              <AsyncSearchDirectionBox text="Origen" onSelectionChange={onOriginSelectionChange} />
            </div>
            <div>
              <AsyncSearchDirectionBox text="Destino" onSelectionChange={onDestinationSelectionChange} />
            </div>
            <div>
              <Switch isSelected={isProgrammed} onValueChange={setIsProgrammed}>
                <span>Programar</span>
              </Switch>
              {
                isProgrammed && (
                  <div>
                    <DatePicker className="max-w" variant="underlined" granularity='minute' label="Fecha de inicio" />
                  </div>
                )
              }
            </div>
            <div>
              <Textarea
                label="Comentarios"
                placeholder="Comentarios adicionales..."
            
                variant="underlined"
              />
            </div>
  
  
  
            <Button className='bg-gray-800 ' type="submit">Crear Viaje</Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  export default NewRideCard;