// ../../hooks/useAddress.ts
export const useAddress = () => {
  const baseURL = process.env.NEXT_PUBLIC_NOMINATIM_URL+'/:8080';

  async function searchAddress(query: string) {
      try {
          const res = await fetch(`${baseURL}/search?q=${query}`);
          if (!res.ok) {
              throw new Error('Error al cargar los datos de la dirección');
          }
          const data = await res.json();
          return data;
      } catch (err: any) {
          console.log(err);
          return { error: err.message };
      }
  }

  return {
      searchAddress,
  };
};