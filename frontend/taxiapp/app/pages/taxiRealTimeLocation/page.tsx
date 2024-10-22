import React from "react";
import MapComponent from "../../components/RTLMapComponent/page";
import "leaflet/dist/leaflet.css";
import RTLMapComponent from "../../components/RTLMapComponent/page";

const TaxiRealTimeLocation: React.FC = () => {
  const markers = [
    { lat: 51.505, lng: -0.09, display_name: "London" },
    // Puedes añadir más marcadores aquí
  ];

  return (
    <div className="container">
      <div className="main-content">
        <div className="map-container">
          <RTLMapComponent />
        </div>
      </div>
    </div>
  );
};

export default TaxiRealTimeLocation;