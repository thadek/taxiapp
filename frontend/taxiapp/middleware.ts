export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/authorizedOnly/:path*","/dashboard","/mapa","/estimar","/dorime","/settings"],
};