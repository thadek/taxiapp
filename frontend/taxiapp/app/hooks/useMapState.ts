import { useState, useCallback } from 'react';

type Marker = {
  lat: number;
  lng: number;
  display_name: string;
};



export const useMapState = () => {
  const [center, setCenter] = useState<[number, number]>([-38.952531, -68.059168]);
  const [zoom, setZoom] = useState<number>(13);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [route, setRoute] = useState<[number, number][]>([]);

  const addMarker = useCallback((marker: Marker) => {
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  }, []);

  const clearMarkers = useCallback(() => {
    setMarkers([]);
  }, []);

  const setMapCenter = useCallback((lat: number, lng: number) => {
    setCenter([lat, lng]);
  }, []);

  const setMapZoom = useCallback((zoomLevel: number) => {
    setZoom(zoomLevel);
  }, []);

  const setRouteBetweenPoints = useCallback((points: [number, number][]) => {
    setRoute(points);
  }, []);

  return {
    center,
    zoom,
    markers,
    route,
    setMapCenter,
    setMapZoom,
    addMarker,
    clearMarkers,
    setRouteBetweenPoints,
  };
};