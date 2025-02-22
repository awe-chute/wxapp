const express = require('express');
const axios = require('axios');
const cors = require('cors');

const { randomBytes } = require('crypto');
const app = express();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 4000;

const plants = [];

app.use(express.json());
app.use(cors());

app.post('/plants', async (req, res) => {

    //Generate a random ID
    const id = randomBytes(2).toString('hex');

    //Pass plantName and waterAmount through request body
    const { plantName } = req.body;
    const { waterAmount } = req.body;

    //Check if plantName is not blank and waterAmount is an integer
    if (!isBlank(plantName) && isIntegerString(waterAmount)) {

        //Create the plant
        plants[id] = { id, plantName, waterAmount };

        //On creation, send the event request to event-bus
        await axios.post('http://localhost:4005/events', {
            type: "plantAdded",
            data: { id, plantName, waterAmount }
        });

        //Send successful message
        res.status(201).send(plants[id]);
    }
    else {

        //Send failure
        res.status(400).json({ error: 'Plant name cannot be blank. Water amount must be an integer.' });
    }

});

app.delete('/plants/:id', async (req, res) => {

    //Remove plant
    const { id } = req.params;

    if (plants[id]) {
        delete plants[id];
        res.status(200).json({ message: 'Plant deleted.' });
    }
    else {
        res.status(404).json({ error: 'Plant not found.' });
    }
});

app.get('/plants', (req, res) => {

    //Fetch all the available posts as response
    res.send(plants);
});

//Endpoint to receive events from the event-bus
app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'precipitationUpdate') {

        //Send complete list of plants and water amounts to event-bus
        await axios.post('http://localhost:4005/events', {
            type: "plantList",
            data: plants
        });

    }
    console.log("Event Received", req.body);
    res.send({});
});

app.listen(PORT, HOST, () => {
    console.log(`Plants Service running at ${HOST}:${PORT}.`);
});

function isIntegerString(str) {
    const num = Number(str);
    return Number.isInteger(num);
}

function isBlank(str) {
    return str.trim().length === 0;
}