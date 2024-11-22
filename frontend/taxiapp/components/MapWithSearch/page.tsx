"use client";

import React, { useEffect, useState } from "react";
import MapComponent from "../MapComponent/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Map } from "lucide-react";
import AsyncSearchDirectionBox from "../AsyncSearchDirectionBox/AsyncSearchDirectionBox";

import RTLMapComponent from "../RTLMapComponent/page";

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

  const [fieldState2, setFieldState2] = useState({
      
    });



  const handleSearchResult = (results: SearchResult[]) => {
    const newMarkers = results.map((result) => ({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
    }));
    setMarkers(newMarkers);
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex gap-3"><Map/>Mapa en vivo</CardTitle>
        <Separator className=" " />
      </CardHeader>
      <CardContent className="h-[33vh]">
       {/**<MapComponent/> */} 
       <RTLMapComponent />
      </CardContent>
    </Card>


  );
};

export default MapWithSearch;