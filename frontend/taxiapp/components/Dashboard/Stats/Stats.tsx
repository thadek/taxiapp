'use client'
import ServiceStatus from './ServiceStatus';
import PendingRidesMiniCard from './PendingRidesMiniCard';
import ScheduledRidesMiniCard from './ScheduledRidesMiniCard';


const Stats = ({ status, message }:{status:string,message:any}) => {
    return( 
    <div className="grid grid-cols-3 gap-6 mb-6">
        <ServiceStatus status={status} />
        <PendingRidesMiniCard message={message} />
        <ScheduledRidesMiniCard message={message} />
    </div>
)}


export default Stats;