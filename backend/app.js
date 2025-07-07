const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const contestRoutes = require('./routes/contestRoutes');
const leetcodeRoutes = require('./routes/leetcode');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', protectedRoutes);  // <-- new protected route
app.use('/api/contests', contestRoutes);
app.use('/api/fetch', leetcodeRoutes);

module.exports = app;
