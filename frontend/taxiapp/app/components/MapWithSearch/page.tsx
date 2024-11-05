"use client";

import React, { useEffect, useState } from "react";
import MapComponent from "../MapComponent/page";
import SearchComponent from "../SearchComponent/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Map } from "lucide-react";
import AsyncSearchDirectionBox from "../AsyncSearchDirectionBox/AsyncSearchDirectionBox";


interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface LatLong {
  lat: number;
  lng: number;
}

const MapWithSearch: React.FC = () => {
  const [markers, setMarkers] = useState<{ lat: number; lng: number; display_name: string }[]>([]);
  const [center, setCenter] = React.useState<LatLong>({ });

  const [fieldState, setFieldState] = useState({
    
  });

  const onSelectionChange = (key:any) => {
    console.log(key)
    //setCenter({ lat: parseFloat(selection.lat), lng: parseFloat(selection.lon) });
  }

  const handleSearchResult = (results: SearchResult[]) => {
    const newMarkers = results.map((result) => ({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
    }));
    setMarkers(newMarkers);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex gap-3"><Map/>Mapa</CardTitle>
        <Separator className="my-4" />
      </CardHeader>
      <CardContent>
        <MapComponent/>
      </CardContent>
      <Separator className="my-4" />
      <CardContent>
        <AsyncSearchDirectionBox text="Buscar dirección" onSelectionChange={onSelectionChange} setFieldState={setFieldState}/>
      </CardContent>
      
    </Card>


  );
};

export default MapWithSearch;