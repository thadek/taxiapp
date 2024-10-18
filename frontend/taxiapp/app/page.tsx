"use client";
import MapWithSearch from "./components/MapWithSearch/page";
import "leaflet/dist/leaflet.css";

export default function Home() {

  return (
    <div className="container">
      <main className="main-content">
        <div className="map-container">
          <MapWithSearch />
        </div>
      </main>
    </div>
  );
}