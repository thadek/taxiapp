import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator"



export const generateMetadata = () => {
  return {
    title: "Dashboard - TaxiApp",
  };
}

export default function Dashboard() {

  const Map = useMemo(() => dynamic(() => import("@/components/MapWithSearch/page"), { ssr: false }), []);
  
  
  return (

    <div className=" bg-gray-800 justify-center">
      <main className="flex flex-col items-center gap-3 p-3">
        <h1 className="text-2xl font-bold p-3">Dashboard</h1>
        <div className="w-1/2 ">
          <Map />
        </div>
      </main>
    </div>

  );
}

