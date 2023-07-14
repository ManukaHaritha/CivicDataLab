const mongoose = require('mongoose');
const app = require('./api');
const { fetchDataAndStore, Earthquake } = require('./earthquake');
// Establish MongoDB connection
//mongoose.connect('mongodb://127.0.0.1:27017/', {
  mongoose.connect('mongodb+srv://9haritha:civicdatalab@map-api.niogn3s.mongodb.net/?retryWrites=true&w=majority',{
  
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the API server

    const PORT=process.env.PORT;
    app.listen(PORT, () => {
      console.log('API server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });
