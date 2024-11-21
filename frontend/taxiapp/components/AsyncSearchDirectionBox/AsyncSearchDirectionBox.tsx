'use client'

import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from 'react-stately'


type LocationResult = {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
}

type FieldState = {
  selectedKey: React.Key | null;
};



function generateRandomLetters() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const firstLetter = letters[Math.floor(Math.random() * letters.length)];
  const secondLetter = letters[Math.floor(Math.random() * letters.length)];
  return firstLetter + secondLetter;
}

export default function AsyncSearchDirectionBox({ text, onSelectionChange }: { text: string, onSelectionChange: (key: React.Key | null) => void }) {


  const nominatimUrl = process.env.NEXT_PUBLIC_NOMINATIM_URL;

  const list = useAsyncList<LocationResult>({
    async load({ signal, filterText }) {
      const res = await fetch(`${nominatimUrl}/search?q=${filterText}`, { signal });
      const json = await res.json();
      return {
        items: json,

      };
    },
  });



  return (<>
    <Autocomplete
      className="w-full"
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      label={text}
      placeholder="Escribí para buscar..."
      variant="underlined"
      onSelectionChange={onSelectionChange}
      onInputChange={list.setFilterText}
    >
      {(item) => (
        <AutocompleteItem key={`${item.lat},${item.lon}`} className="capitalize">
          {item.display_name}
        </AutocompleteItem>
      )}
    </Autocomplete>

  </>
  );


}
