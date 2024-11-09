'use client'
import AsyncSearchDirectionBox from "@/app/components/AsyncSearchDirectionBox/AsyncSearchDirectionBox"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@nextui-org/button";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import SearchMapBox from "@/app/components/SearchMapBox/SearchMapBox";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

import MapWithRoute from "@/app/components/MapWithRoute/MapWithRoute";




const parseCoords = (coords: string) => {
  return coords.split(",").map((coord) => parseFloat(coord));
}


type MapBoxResponse = {
  geometry: {
    coordinates: number[]
  }
}

export default function EstimarViajeCard() {

  //const Map = dynamic(() => import("@/app/components/MapWithRoute/MapWithRoute"), { ssr: false });

  const [origen, setOrigen] = useState<MapBoxResponse>();
  const [destino, setDestino] = useState<MapBoxResponse>();

  const [selected, setSelected] = useState<string>("Nocturno");
  const [mostrarMapa, setMostrarMapa] = useState<boolean>(false);
  // const [costo, setCosto] = useState<number>(0);



  const onSelectionChange = (key: any) => {

    if (key === null) {
      return;
    }

    const coords = parseCoords(key);
    /*@ts-ignore */
    const coordParsed = { geometry: { coordinates: [coords[1], coords[0]] } };

    setOrigen(coordParsed);


  }

  const onSelectionChange2 = (key: any) => {

    if (key === null) {
      return;
    }

    const coords = parseCoords(key);
    /*@ts-ignore */
    const coordParsed = { geometry: { coordinates: [coords[1], coords[0]] } };

    setDestino(coordParsed);


  }


  const handleCalcularRuta = () => {
    if (!origen || !destino) {
      toast.error("Debe seleccionar origen y destino");
      return;
    }

    toast.info('Calculando ruta...');
    setMostrarMapa(true);
  }


  const handleCostoSegunHorario = () => {
    if (selected === "diurno") {
      return { name: "diurno", costoporKm: 1000 };
    } else {
      return { name: "nocturno", costoporKm: 2500 };
    }
  }





  return (<>
    <Card className="w-[30vw] h-full">
      <CardHeader>
        <CardTitle>Estimar costo de viaje</CardTitle>

      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 gap-3">

              {/* <SearchMapBox text="Origen" setRetrieve={setOrigen} />

              <SearchMapBox text="Destino" setRetrieve={setDestino} /> */}

              <AsyncSearchDirectionBox text="Origen" onSelectionChange={onSelectionChange} />
              <AsyncSearchDirectionBox text="Destino" onSelectionChange={onSelectionChange2} />




              <RadioGroup
                defaultValue={selected}
                onValueChange={setSelected}>
                <Label htmlFor="r4">Turno del viaje</Label>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diurno" id="r1" />
                  <Label htmlFor="r1">Diurno</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nocturno" id="r2" />
                  <Label htmlFor="r2">Nocturno</Label>
                </div>

              </RadioGroup>


            </div>


          </div>

          {/*

          */}



        </form>
        <Button className="p-1 mt-7" onClick={handleCalcularRuta}> Calcular </Button>
      </CardContent>



    </Card>

    <CardFooter className="flex-col items-start w-full relative">



      {mostrarMapa &&
        <>
          <MapWithRoute turno={handleCostoSegunHorario()} start={origen?.geometry.coordinates} end={destino?.geometry.coordinates} />
        </>}
    </CardFooter>


  </>

  )
}