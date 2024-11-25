'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import Stats from './Stats'
import RidesToConfirm from './RidesToConfirm';
import OngoingTrips from './OnGoingRides';
import NewRideCard from './NewRideCard';
import useWebSocketSubscription from '@/hooks/useSocket'
import MapWithSearch from '@/components/MapWithSearch/page'
import ActiveRidesTable from './ActiveRidesTable';




const TaxiMap = ({ }) => {
 // const Map =  dynamic(() => import("@/components/MapWithSearch/page"), { ssr: false });
  return (
    <MapWithSearch />
  )
}

export default function Dash({ }) {

  const { message } = useWebSocketSubscription(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`, '/topic/rides'); 


  return (
    <div className="flex-1 p-8  bg-slate-900 overflow-hidden">
     <Stats
        tripsCount={3}
        driversCount={1}
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