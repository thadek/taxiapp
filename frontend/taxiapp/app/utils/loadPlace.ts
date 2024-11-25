const loadPlace = async (coords: string) => {
    const [lat, lon] = coords.split(',');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NOMINATIM_URL}/reverse?lat=${lat}&lon=${lon}&format=geocodejson`);
      const data = await response.json();

      if(!data.features || data.features.length === 0) {
        return 'Dirección no georeferenciada';
      }

      const {name, street, housenumber, city, state} = data.features[0].properties.geocoding;
      return `${street?street:""} ${housenumber? housenumber:""}, ${city?city:""}, ${state?state:""} (Estimado)`;
    } catch (error) {
      console.error('Error fetching place name:', error);
      return 'Error obteniendo dirección';
    }
  };

  export { loadPlace };