/*import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from 'next-auth';
*/

/**
 * Obtener ruta de un punto a otro
 * @returns 
 */
const getDirection = async (start:string, end:string) => {
    const response = await fetch(`/api/maps/directions?start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`)
    return response.json()
}
export { getDirection }


