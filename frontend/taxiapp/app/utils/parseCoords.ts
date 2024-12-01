const parseCoords = (coords: string) => {
    return coords.split(",").map((coord) => parseFloat(coord));
  }

  export { parseCoords }