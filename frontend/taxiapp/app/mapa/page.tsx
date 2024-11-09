//Componente que muestra el mapa a partir del mapwwithroute
//Se encarga de mostrar la ruta y los marcadores de inicio y fin
import React, { useState } from "react";
import MapWithRoute from "../components/MapWithRoute/MapWithRoute";

export default function Mapa() {
 /* const [start, setStart] = useState([0, 0]);
  const [end, setEnd] = useState([0, 0]);*/

  const start = [-38.940916,-68.055418]; 
  const end = [-38.95171,-68.140441];

  return (
    <div className="w-full">
      <MapWithRoute start={start} end={end} />
    </div>
  );
}