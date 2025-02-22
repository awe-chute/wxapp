const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 4002;

app.use(express.json());
app.use(cors());

let totalPrecipitation = 0;

// Endpoint to receive events from the event-bus
app.post('/events', (req, res) => {

    const { type, data } = req.body;

    // Check if the event is of type 'precipitationUpdate'
    if (type === 'precipitationUpdate') {
        if (data.totalPrecipitationLastWeek) {
            // Total precipitation in mm, which represents one cubic mm per square mm (1mm^3/1mm^2)
            totalPrecipitation = parseFloat(data.totalPrecipitationLastWeek);

            // There are .001mL in 1mm^3, so multiply by .001mL
            totalPrecipitation = totalPrecipitation * .001;

            // Convert mm^2 to m^2 for a more reasonable plant surface area, leaves us with a measurement in mL to compare with waterAmount for each plant (also in mL)
            totalPrecipitation = totalPrecipitation / .000001;

            console.log(`Adjusted total precipitation is ${totalPrecipitation} mL.`);
        } else {
            console.log("Precipitation data missing for the week.");
        }
    }

    // Check if the event is of type 'plantList'
    if (type === 'plantList') {

        if (!isEmptyObject(data)) {

            // Iterate over plant data (use Object.values to simplify iteration)
            Object.values(data).forEach(plant => {
                if (parseFloat(plant.waterAmount) > totalPrecipitation) {
                    console.log(`${plant.plantName} requires ${plant.waterAmount} mL, which is greater than the weekly total of ${totalPrecipitation} mL.`);
                }
            });

        } else {
            console.log("Plant list is empty.");
        }

    }

    console.log("Event Received", req.body);
    res.send({});
});


app.listen(PORT, HOST, () => {
    console.log(`Calculation Service running at http://${HOST}:${PORT}.`);
});

function isEmptyObject(obj) {
    return !obj || Object.keys(obj).length === 0;
}
