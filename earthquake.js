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
const axiosInstance = axios.create({
  timeout: 10000, // Set a higher timeout value in milliseconds (e.g., 10000 for 10 seconds)
});

async function fetchDataAndStore() {
  try {
    // Make HTTP GET request to the API endpoint
    const response = await axiosInstance.get('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json');
    const myapi = await axios.get('http://localhost:3000/earthquakes');
    // Extract earthquake data from the API response
    const { gempa } = response.data.Infogempa;
    const earthquakes = [];

    // Iterate over the earthquakes and validate and transform the datetime field
    for (const earthquakeData of gempa) {
      const datetimeString = earthquakeData.Tanggal + ' ' + earthquakeData.Jam;

      try {
        const datetime = moment(datetimeString, 'DD MMM YYYY HH:mm:ss Z [WIB]').toDate();
        const existingEarthquake = await Earthquake.findOne({ datetime });

        if (existingEarthquake) {
          console.log(`Earthquake with datetime ${datetimeString} already exists in the collection.`);
        } else {
          const earthquake = new Earthquake({
            location: {
              latitude: parseFloat(earthquakeData.Lintang),
              longitude: parseFloat(earthquakeData.Bujur),
            },
            datetime,
            region: earthquakeData.Wilayah,
            magnitude: parseFloat(earthquakeData.Magnitude),
          });

          await earthquake.save();
          console.log(`New earthquake with datetime ${datetimeString} inserted into the collection.`);
        }
      } catch (error) {
        console.warn(`Invalid date for earthquake: ${datetimeString}`);
        continue;
      }
    }

    console.log('Earthquake data stored successfully.');
  } catch (error) {
    console.error('Failed to fetch or store earthquake data:', error);
  } finally {
    //mongoose.connection.close();
  }
}
fetchDataAndStore();
module.exports = Earthquake;

