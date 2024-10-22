"use client";

import React, { useState } from "react";
import MapComponent from "../MapComponent/page";
import SearchComponent from "../SearchComponent/page";

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

const MapWithSearch: React.FC = () => {
  const [markers, setMarkers] = useState<{ lat: number; lng: number; display_name: string }[]>([]);

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
      <MapComponent markers={markers} />
    </div>
  );
};

export default MapWithSearch;