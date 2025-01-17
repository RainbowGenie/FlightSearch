import express from 'express';
import { searchFlights } from './flightService.js';

const app = express();

app.post('/search-flights', async(req, res) => {
    try {
        const {departureMin, departureMax, maxDuration, preferredAirline} = req.body;
        const flights = await searchFlights(departureMin, departureMax, maxDuration, preferredAirline);
        res.json(flights);

    } catch(error) {
        console.error(error);
        res.status(500).send('An error occurred while searching for flights');
    }
});

app.get('/', async(req, res) => {
    res.json({message: 'Welcome to the flight search service'});
})



app.listen(5000, () => {
    console.log('Server is running on port 5000');
})