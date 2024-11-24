const loadPlace = async (coords: string) => {
    const [lat, lon] = coords.split(',');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NOMINATIM_URL}/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await response.json();
      return data.address ? `${data.address.road} ${data.address.house_number}, ${data.address.city} (Estimado)` : 'Ubicación no geo-referenciada';
    } catch (error) {
      console.error('Error fetching place name:', error);
      return 'Error obteniendo dirección';
    }
  };

  export { loadPlace };