
import EstimationCard from "../components/EstimationCard/EstimationCard"


export default function Dorime() {
    return (
        <div className="h-[97vh] w-full">
            <EstimationCard start={[-58.3816, -34.6037]} end={[-59.3816, -34.6037]} distance={1000} shift={{ name: "diurno", costoporKm: 1000 }} />
        </div>

    )
}