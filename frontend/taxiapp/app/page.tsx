"use client";

import Header from "@components/Header";


export default function Home() {
  return (
      <div>
            <Header />
          <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center h-screen">
                  <h1>Bienvenido a la taxiApp</h1>
                  <p>La mejor app de taxis del mercado!</p>

              </div>
          </div>
      </div>
  );
}
