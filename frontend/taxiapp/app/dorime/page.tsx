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

        <div>
      <h1>MESSAGE TOPIC RIDES</h1>
      <pre>
        <code>{JSON.stringify(message, null, 2)}</code>
      </pre>
    </div>
        
    )
}


