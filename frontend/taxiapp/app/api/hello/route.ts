import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"


// defaults to auto
export async function GET(req:Request, res:Response) {

  const session = await  getServerSession(authOptions);
  

  return new Response(JSON.stringify({ session }), {
    headers: { "Content-Type": "application/json" },
  });
}