'use client'
import React from 'react'

import Stats from '@/components/Dashboard/Stats/Stats'
import RidesToConfirm from './RidesToConfirm';

import NewRideCard from './NewRideCard';
import useWebSocketSubscription from '@/hooks/useSocket'
import MapWithSearch from '@/components/MapWithSearch/page'
import ActiveRidesTable from './ActiveRidesTable';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';





const TaxiMap = ({ }) => {

  return useMemo(() => {
    const Map =  dynamic(() => import("@/components/MapWithSearch/page"), { ssr: false });
    return (
      <Map />
    )
  }
  , [])
}

export default function Dash({ }) {

  const { message, status } = useWebSocketSubscription(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`, '/topic/rides'); 


  

  return (
    <div className="flex-1 p-8 min-h-screen  bg-slate-300 dark:bg-slate-900 overflow-hidden">
     <Stats
        status={status}
        message={message}
      />
      
      <div className="grid grid-cols-3 gap-6">
      
        <NewRideCard/>
        <TaxiMap />   
        <RidesToConfirm webSocketMsg={message} />
        <ActiveRidesTable webSocketMsg={message}/>
      </div>

    </div>
  )
}