const express = require('express');
const router = express.Router();

const scheduleAllNotifications = require('../utils/scheduleNotification');

router.get('/mail',scheduleAllNotifications);            // GET /api/user/profile

module.exports = router;