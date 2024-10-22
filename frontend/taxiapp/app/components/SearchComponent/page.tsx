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
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar dirección..."
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchComponent;