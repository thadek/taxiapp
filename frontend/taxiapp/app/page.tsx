'use client'
import { useEffect, useState } from 'react';
import localFont from 'next/font/local'

const myFont = localFont({ src: './fonts/Speeday-Bold-FFP.ttf' })

const Home = () => {
  
  const [isClient, setIsClient] = useState(false);

  // Solo se renderiza en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Solo mostrar el video si estamos en el cliente */}
      {isClient && (
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/lib/video/taxi-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Contenedor encima del video */}
      <div className="relative z-1 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-50">
        <h1 className={`${myFont.className} text-7xl  mb-4`}>TaxiApp</h1>
        <p className="text-xl mb-6">
          La solución para la gestión eficiente de taxis, desde la solicitud hasta la asignación en tiempo real.
        </p>
        <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg">
          Descubre más
        </button>
      </div>
    </div>
  );
};

export default Home;
