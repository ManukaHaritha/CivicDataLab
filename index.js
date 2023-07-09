const mongoose = require('mongoose');
const app = require('./api');
const { fetchDataAndStore, Earthquake } = require('./earthquake');

// Establish MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/GeoDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: 0,
  },
})
  .then(() => {
    console.log('Connected to MongoDB');
   // fetchDataAndStore();
    // Start the API server
    app.listen(3000, () => {
      console.log('API server is running on port 3001');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });
  
