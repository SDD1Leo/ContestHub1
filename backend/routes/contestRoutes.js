const express = require('express');
const router = express.Router();
const fetchCodeforcesContests = require('../services/codeforcesFetcher');
const fetchLeetcodeContests = require('../services/leetcodeFetcher');
const fetchCodechefContests = require('../services/codechefFetcher');
const fetchAllContests = require('../services/dashboardService');
const saveContestsToDB = require('../utils/saveContestsToDB');
const authMiddleware = require('../middlewares/authMiddleware');
const Contest = require("../models/Contest");

// Update Codeforces contests and save to DB
router.get('/update/codeforces', authMiddleware, async (req, res) => {
  try {
    const contests = await fetchCodeforcesContests();
    await saveContestsToDB(contests);
    res.json({ msg: `Fetched and saved ${contests.length} Codeforces contests.`, contests });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching Codeforces contests.' });
  }
});

// Update LeetCode contests and save to DB
router.get('/update/leetcode', authMiddleware, async (req, res) => {
  try {
    const contests = await fetchLeetcodeContests();
    await saveContestsToDB(contests);
    res.json({ msg: `Fetched and saved ${contests.length} LeetCode contests.`, contests });
  } catch (error) {
    console.error('LeetCode Route Error:', error);
    res.status(500).json({ msg: 'Error fetching LeetCode contests.' });
  }
});

// Update CodeChef contests and save to DB
router.get('/update/codechef', authMiddleware, async (req, res) => {
  try {
    const contests = await fetchCodechefContests();
    await saveContestsToDB(contests);
    res.json({ msg: `Fetched and saved ${contests.length} CodeChef contests.`, contests });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching CodeChef contests.' });
  }
});

// Fetch all contests from all platforms, save to DB and return for dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const contests = await fetchAllContests();  // This function should already call saveContestsToDB internally
    res.status(200).json({
      msg: `Found ${contests.length} upcoming contests.`,
      contests,
    });
  } catch (err) {
    console.error('Dashboard Route Error:', err.message);
    res.status(500).json({ msg: 'Failed to load dashboard.' });
  }
});

router.get("/dbcontest", authMiddleware, async (req, res) => {
  try {
    const contests = await Contest.find({});
    res.status(200).json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = router;
