const express = require('express');
const axios = require('axios');
const app = express();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 4005;

app.use(express.json());

app.post('/events', (req, res) => {
    const event = req.body;
    console.log("Event Received", req.body);

    // Send the event to plants microservice
    axios.post('http://localhost:4000/events', event);
    console.log("Event sent to plants");
    // Send the event to precipitation microservice
    axios.post('http://localhost:4001/events', event);
    console.log("Event sent to precipitation");
    // Send the event to calculation microservice
    axios.post('http://localhost:4002/events', event);
    console.log("Event sent to calculation");
    res.send({ status: 'Successful!' });
});

app.listen(PORT, HOST () => {
    console.log(`Event Bus running at http://${HOST}:${PORT}`);
});
