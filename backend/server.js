const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

// ✅ Initialize contest scheduler
require('./scheduler'); 
const scheduleAllNotifications = require('./utils/scheduleNotification');




const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    scheduleAllNotifications();
  })
  .catch((err) => console.error('Mongo Error:', err));
