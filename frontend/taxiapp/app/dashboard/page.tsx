"use client";
import MapWithSearch from "../components/MapWithSearch/page";
import "leaflet/dist/leaflet.css";

export default function Dashboard() {

  return (
    <div className="h-[100vh] bg-gray-800 justify-center">
      <main className="flex ">
        <div className="w-full">
          <MapWithSearch />
        </div>
      </main>
    </div>
  );
}