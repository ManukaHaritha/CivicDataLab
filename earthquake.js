const axios = require('axios').default;
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const earthquakeSchema = new mongoose.Schema({
  datetime: { type: Date, required: true },
  region: { type: String, required: true },
  magnitude: { type: Number, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
});

const Earthquake = mongoose.model('Earthquake', earthquakeSchema);

async function fetchDataAndStore() {
  try {
    // Make HTTP GET request to the API endpoint
    const response = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json');

    // Extract earthquake data from the API response
    const { gempa } = response.data.Infogempa;
    const earthquakes = [];

    // Iterate over the earthquakes and validate and transform the datetime field
    for (const earthquakeData of gempa) {
      const datetimeString = earthquakeData.Tanggal + ' ' + earthquakeData.Jam;

      try {
        const datetime = moment(datetimeString, 'DD MMM YYYY HH:mm:ss Z [WIB]').toDate();
        
        const earthquake = new Earthquake({
          location: {
            latitude: parseFloat(earthquakeData.Lintang),
            longitude: parseFloat(earthquakeData.Bujur),
          },
          datetime,
          region: earthquakeData.Wilayah,
          magnitude: parseFloat(earthquakeData.Magnitude),
          
        });

        earthquakes.push(earthquake);
      } catch (error) {
        console.warn(`Invalid date for earthquake: ${datetimeString}`);
        continue;
      }
    }

    // Save each valid earthquake document to the MongoDB collection
    for (const earthquake of earthquakes) {
      await earthquake.save();
    }

    console.log('Earthquake data stored successfully.');
  } catch (error) {
    console.error('Failed to fetch or store earthquake data:', error);
  } finally {
    mongoose.connection.close();
  }
}

module.exports = fetchDataAndStore;
module.exports=Earthquake;