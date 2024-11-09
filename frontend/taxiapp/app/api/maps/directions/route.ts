import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server";
import { checkMultipleRoles } from "@/app/utils/role-check";



export async function GET(req: NextRequest, res: NextResponse) {

  try {
    const session = await getServerSession(authOptions);
    

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { "Content-Type": "application/json" },
        status: 401
      });
    }

  
    if (!checkMultipleRoles(["ROLE_ADMIN", "ROLE_OPERATOR"], session.user.roles)) {
      return new Response(JSON.stringify({ error: "Forbidden - You don't have permission to access this resource." }), {
        headers: { "Content-Type": "application/json" },
        status: 403
      });
    }



    const params = req.nextUrl.searchParams;
    if (params.has("start") && params.has("end")) {
      const start = params.get("start")?.split(",").map(Number) || [];
      const end = params.get("end")?.split(",").map(Number) || [];

      const accessToken = process.env.NEXT_MAPBOX_API_KEY;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === "Ok") {
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
          status: 200
        });
      } else {
        return new Response(JSON.stringify({ error:{
          code: data.code,
          message: data.message
        } }), {
          headers: { "Content-Type": "application/json" },
          status: 500
        });
      }

    } else {
      return new Response(JSON.stringify({ error: "Missing start or end query parameter" }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }


  } catch (error) {
    console.log(error)
  }
}





