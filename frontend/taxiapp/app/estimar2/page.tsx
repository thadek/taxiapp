import EstimarViajeCard from "@/components/card-estimar-viaje";
import EstimarViajeCardMapbox from "@/components/card-estimar-viaje-mapbox";

export const generateMetadata = () => {
  return {
    title: "Estimar viaje - TaxiApp",
  };
}


export default function Estimar() {	

  return (
    <div className=" min-h-full content-center bg-slate-900 ">
      <main className="flex flex-col items-center  gap-3 p-3 ">      
        <EstimarViajeCardMapbox />
      </main>
    </div>
  );
}