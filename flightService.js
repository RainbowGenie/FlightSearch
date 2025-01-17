import axios from 'axios';

async function fetchFlightData() {
    const response = await axios.get('https://gist.githubusercontent.com/bgdavidx/132a9e3b9c70897bc07cfa5ca25747be/raw/8dbbe1db38087fad4a8c8ade48e741d6fad8c872/gistfile1.txt');
    return response.formData.split('\n').map(line => JSON.parse(line));
}

async function getDistanceBetweenAirports(code1, code2) {

}

export async function searchFlights(departureMin, departureMax, maxDuration, preferredAirline) {
    const flightData = await fetchFlightData();

    const filteredFlights = flightData.filter(flight => {
        const departureTime = new Date(flight.departureTime);
        const arrivalTime = new Date(flight.arrivalTime);
        const duration = (arrivalTime - departureTime) / (1000 * 60 * 60);

        return (
            departureTime >= new Date(departureMin) &&
            departureTime <= new Date(departureMax) &&
            duration <= maxDuration
        );
    });

    const scoredFlights = await Promise.all(filteredFlights.map(async (flight) => {
        const distance = await getDistanceBetweenAirports(flight.origin, flight.destination);
        const carrierScore = flight.carrier === preferredAirline ? 0.9 : 1.0;
        const duration = (new Date(flight.arrivalTime) - new Date(flight.departureTime)) / (1000 * 60 * 60);
        flight.score = (duration * carrierScore) + distance;
        return flight;
    }));

    return scoredFlights.sort((a, b) => a.score - b.score);
}
;