"use client";

import React, { useEffect, useState } from "react";
import MapComponent from "../MapComponent/page";
import SearchComponent from "../SearchComponent/page";

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
  const [center, setCenter] = React.useState<LatLong>({lat: -38.952531, lng: -68.059168});


  const handleSearchResult = (results: SearchResult[]) => {
    const newMarkers = results.map((result) => ({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
    }));
    setMarkers(newMarkers);
  };

  return (
    <div>
      <SearchComponent onSearchResult={handleSearchResult} />
      <MapComponent markers={markers} center={center}/>
    </div>
  );
};

export default MapWithSearch;