export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/authorizedOnly/:path*","/dash","/mapa","/estimar","/dorime","/settings","/rides"],
};