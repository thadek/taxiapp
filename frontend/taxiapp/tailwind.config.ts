import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGreen: '#032221',        // Verde oscuro y profundo
        bangladeshGreen: '#03624C',  // Verde verdoso, similar al color de la vegetación
        mountainMeadow: '#2CC2B5',   // Verde claro, evoca prados montañosos
        caribbeanGreen: '#00D7D9',   // Verde turquesa, similar al color del mar Caribe
        antiFlashWhite: '#F7FFFE',   // Blanco muy claro, casi transparente
        pine: '#06002B',             // Verde oscuro, similar al color de las agujas de pino
        basil: '#08423A',            // Verde oscuro con matices azulados, similar al color de la albahaca
        forest: '#095444',           // Verde oscuro y terroso, propio de los bosques
        frog: '#177ED9',             // Verde azulado, similar al color de una rana
        mint: '#78A8BC',             // Verde claro y refrescante, similar al color de la menta
        stone: '#707D7D',            // Gris oscuro, similar al color de una piedra
        pistachio: '#AACBC4',        // Verde suave y claro, similar al color del pistacho
      },
    },
  },
  plugins: [],
};
export default config;
