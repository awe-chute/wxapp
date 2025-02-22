require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 4001;
const HOST = process.env.HOST || "0.0.0.0";
const LAT = process.env.LATITUDE || 39.374912;
const LON = process.env.LONGITUDE || -104.853859;
const TIMEZONE = process.env.TIMEZONE || "America/Denver";

let totalPrecipitationLastWeek = 0; // Stores the last 7-day precipitation total

app.use(express.json());
app.use(cors());

// Function to get precipitation totals (Millimeters) from Open-Meteo API
async function getPastWeekPrecipitation() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=precipitation_sum&timezone=${TIMEZONE}&past_days=7`;

    try {
        const response = await axios.get(url);
        const precipitationData = response.data.daily.precipitation_sum || [];

        // Sum the precipitation over the past 7 days
        totalPrecipitationLastWeek = precipitationData.reduce((sum, value) => sum + (value || 0), 0);
        console.log(`Updated Total Precipitation for the Last 7 Days: ${totalPrecipitationLastWeek} mm`);

        //On update, send the event request to event-bus
        await axios.post('http://localhost:4005/events', {
            type: "precipitationUpdate",
            data: { totalPrecipitationLastWeek: totalPrecipitationLastWeek }
        });

    } catch (error) {
        console.error('Error fetching precipitation data:', error.message);
    }
}

// Schedule task to run **every 7 days (Sunday at midnight)**
// '0 0 * * 0'
cron.schedule('*/3 * * * *', async () => {
    console.log('Fetching weekly precipitation data...');
    await getPastWeekPrecipitation();
}, {
    scheduled: true,
    timezone: TIMEZONE
});

// Run immediately on server start
getPastWeekPrecipitation();

// API Endpoint to retrieve the total precipitation
app.get('/api/precipitation', (req, res) => {
    res.json({
        totalPrecipitation: totalPrecipitationLastWeek,
        message: totalPrecipitationLastWeek === 0 ? "Data not available yet. Try again later." : "Precipitation data fetched successfully."
    });
});

//Endpoint to receive events from the event-bus
app.post('/events', (req, res) => {
    console.log("Event Received", req.body);
});

// Start the Express server
app.listen(PORT, HOST, () => {
    console.log(`Precipitation service running at http://${HOST}:${PORT}.`);
});
