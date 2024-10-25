// components/SearchComponent.js
"use client";
import React, { useState } from "react";
import { useAddress } from "../../hooks/useAdress";

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface SearchComponentProps {
  onSearchResult: (results: SearchResult[]) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearchResult }) => {
  const [query, setQuery] = useState("");
  const { searchAddress } = useAddress();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const results = await searchAddress(query);
    onSearchResult(results);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="absolute top-60 z-20 left-5 bg-white shadow-lg rounded-lg p-4 w-96 "
    >
      <input
        className="p-3 w-full border text-black border-gray-300 rounded-md mb-2"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar dirección..."
      />
      <button
        type="submit"
        className="w-full bg-green-600 p-3 hover:bg-green-800 duration-150 text-white font-semibold rounded-md"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchComponent;