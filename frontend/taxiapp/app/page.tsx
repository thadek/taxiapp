
import dynamic from "next/dynamic";

export const generateMetadata = () => {
  return {
    title: "TaxiApp",
  };
}

export default function IndexPage() {
  const Home = dynamic(() => import('./home'), { ssr: false });
  return (
    <Home />
  );
}
   



