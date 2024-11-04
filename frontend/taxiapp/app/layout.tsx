"use client";
import localFont from "next/font/local";
import "./global.css";
import Navbar from "./components/Navbar/page";
import Head from "next/head";
import SessionAuthProvider from "@/context/SessionAuthProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <Head>
        <link
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          rel="stylesheet"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          async
        ></script>
        <style jsx global>{`
          :root {
            --font-geist-sans: 'Geist Sans', sans-serif;
            --font-geist-mono: 'Geist Mono', monospace;
          }

          body {
            font-family: var(--font-geist-sans);
          }
        `}</style>
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <SessionAuthProvider>
            <Navbar />
            {children}
          </SessionAuthProvider>
        </main>
      </body>
    </html>
  );
}
