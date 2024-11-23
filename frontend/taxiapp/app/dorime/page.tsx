'use client'

import React, { useEffect } from "react";
import useWebSocketSubscription from '@/hooks/useSocket';
import { toast } from "sonner";

export default function Dorime() {


    const {message} = useWebSocketSubscription('http://localhost:8080/api/v1/ws', '/topic/rides');    
    
    useEffect(() => {
    toast.info("TOPIC-RIDES: "+message);
    }, [message]);
    

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {/* Tarjeta con borde brillante */}
      <div className="relative rounded-lg p-[3px] bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-glowingBorder bg-[length:200%_200%]">
        {/* Contenido de la tarjeta */}
        <div className="rounded-lg bg-gray-800 p-6 text-white">
          asad
        </div>
      </div>
    </div>
        
    )
}


