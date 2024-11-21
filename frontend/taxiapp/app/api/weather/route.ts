import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { NextRequest, NextResponse } from "next/server";




export async function GET(req: NextRequest, res: NextResponse) {

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { "Content-Type": "application/json" },
        status: 401
      });
    }


    const params = req.nextUrl.searchParams;
    if (params.has("coords")) {
      const coords = params.get("coords");
      

      const accessToken = process.env.NEXT_WEATHER_API_KEY;
      const url = `http://api.weatherapi.com/v1/current.json?key=${accessToken}&q=${coords}&lang=es&aqi=no`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.location) {
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





