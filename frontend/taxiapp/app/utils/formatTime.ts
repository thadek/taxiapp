


function formatToGMTMinus3(dateString: string): string {
    if (dateString === null) return "N/A"
    const date = new Date(dateString)

    const localDate = new Date(date.getTime());
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires",
    };

    return localDate.toLocaleString("es-AR", options);
}

export { formatToGMTMinus3 }