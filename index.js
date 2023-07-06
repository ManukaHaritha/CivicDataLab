const mongoose = require('mongoose');
const app = require('./api');
require('./earthquake');
// Establish MongoDB connection
mongoose.connect('mongodb://localhost/GeoDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the API server
    app.listen(3001, () => {
      console.log('API server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });
