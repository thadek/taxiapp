import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

 
export default function EstimarViajeCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Estimar costo de viaje</CardTitle>
        
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Dirección de origen</Label>
              <Input id="name" placeholder="Dirección o coordenadas" />
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Dirección de destino</Label>
                <Input id="name" placeholder="Dirección o coordenadas" />
            </div>
          </div>
          
          {/*

          */}



        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        
        <Button >Calcular</Button>
      </CardFooter>
    </Card>
  )
}