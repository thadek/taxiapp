'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Clock, Users } from 'lucide-react';
import { Skeleton } from '@nextui-org/react';
import { CircularProgress } from "@nextui-org/progress";
import ServiceStatus from './ServiceStatus';

import { useQuery } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import PendingRidesMiniCard from './PendingRidesMiniCard';
import ScheduledRidesMiniCard from './ScheduledRidesMiniCard';


const Stats = ({ tripsCount, driversCount, status }:{status:string,tripsCount:number,driversCount:number}) => {
    
    

   


    return(
  
    <div className="grid grid-cols-3 gap-6 mb-6">
        <ServiceStatus status={status} />

        <PendingRidesMiniCard />
       
        <ScheduledRidesMiniCard />
    </div>
)}


export default Stats;