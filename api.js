const express = require('express');
const Earthquakedata = require('./earthquake');
const Earthquake = require('./earthquake');
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});


// Define API routes
app.get('/earthquakes', async (req, res) => {
 
  try {
    const earthquakes = await Earthquake.find();
    console.log(earthquakes);
    // Transform the earthquakes into GeoJSON format
    const geojson = {
        type: 'FeatureCollection',
        features: earthquakes.map((earthquake) => ({
          
          geometry: {
            type: 'Point',
            coordinates: [
              earthquake.location.longitude,
              earthquake.location.latitude,
            ],
          },
          type: 'Feature',
          properties: {
            datetime: earthquake.datetime,
            region: earthquake.region,
            magnitude: earthquake.magnitude,
          },
          
        })),
      };

      const jsonStr = JSON.stringify(geojson, null, 2); // Indentation with 2 spaces

      res.setHeader('Content-Type', 'application/json');
      res.send(jsonStr);
    //res.json(geojson);
  } catch (error) {
    console.error('Failed to fetch earthquake data:', error);
    res.status(500).json({ error: 'Failed to fetch earthquake data' });
  }
});


module.exports = app;

