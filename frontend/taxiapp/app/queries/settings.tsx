import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from 'next-auth';


/**
 * Obtener las configuraciones del servidor
 * @returns 
 */
const getSettings = async () => {
    const session = await getServerSession(authOptions);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/config`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`
            }}
    )
    return response.json()
}

export { getSettings }