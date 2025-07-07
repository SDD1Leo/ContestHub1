const express = require('express');
const router = express.Router();
const { getLeetcodeRating } = require('../controllers/leetcodeController');
const { getCodechefRating } = require('../controllers/codechefController');

router.get('/leetcode/:username', getLeetcodeRating);
router.get('/codechef/:username', getCodechefRating);

module.exports = router;
