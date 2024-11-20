// components/SearchComponent.js
"use client";
import React, { useState } from "react";
import { useAddress } from "../../hooks/useAdress";
import { useMapState } from "../../hooks/useMapState";
import { Button } from "@/components/ui/button";

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}



const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState("");
  const { setMapCenter, addMarker, clearMarkers } = useMapState();
  const { searchAddress } = useAddress(); // Asumo que tienes esta función de búsqueda

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const results = await searchAddress(query);

    // Limpia marcadores anteriores y centra el mapa en el primer resultado
    clearMarkers();
    if (results.length > 0) {
      const { lat, lon, display_name } = results[0];
      setMapCenter(parseFloat(lat), parseFloat(lon));

      // Agrega marcadores para cada resultado de búsqueda
      results.forEach((result:any) => {
        addMarker({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          display_name: display_name,
        });
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="shadow-lg rounded-lg p-4 w-full">
      <input
        className="p-3 w-full border  rounded-md mb-2"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar dirección..."
      />
      
     <Button type="submit">Buscar</Button>
    </form>
  );
};

export default SearchComponent;