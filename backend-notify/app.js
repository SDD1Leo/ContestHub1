const express = require('express');
const cors = require('cors');

const app = express();

const protectedRoutes = require("./routes/protectedRoutes");

app.use(cors());
app.use(express.json());

app.use('/api/notify', protectedRoutes);  // <-- new protected route


module.exports = app;
