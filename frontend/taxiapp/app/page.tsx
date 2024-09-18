
import Header from "@components/Header";
import Image from "next/image";


export default function Home() {
  return (
      <div>
          <Header />
          <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center h-screen pt-4">

                  <h1>Bienvenido a la taxiApp</h1>
                  <p>La mejor app de taxis del mercado!</p>
                  <Image
                      src="/imgTaxiTrompa.png"
                      alt="trompa de taxi"
                      width={500}
                      height={500}
                      className=""
                  />
                  <section className="flex bg-basil h-screen w-9/12 rounded-full items-center justify-center">
                      <p className="text-5xl font-bold">Somos tu comodidad</p>
                  </section>

                  <div className="flex h-screen items-center justify-center ">
                      <div>
                          <p>Sos un conductor?</p>
                      </div>
                      <div>
                          <p>Sos un usuario?</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
