const getWeather = async (coords:string) => {
    const response = await fetch(`/api/weather?coords=${coords}`)
    return response.json()
}
export { getWeather }