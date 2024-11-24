"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Map } from "lucide-react";
import RTLMapComponent from "../RTLMapComponent/page";

const MapWithSearch: React.FC = () => {
 
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