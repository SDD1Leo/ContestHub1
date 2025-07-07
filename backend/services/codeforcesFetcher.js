const axios = require('axios');
const Contest = require('../models/Contest');

async function fetchCodeforcesContests() {
    try {
      const response = await axios.get('https://codeforces.com/api/contest.list');
      const contests = response.data.result
        .filter(contest => contest.phase === 'BEFORE')
        .map(contest => ({
          platform: 'Codeforces',
          name: contest.name,
          startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
          duration: `${Math.floor(contest.durationSeconds / 3600)} hours`,
          url: `https://codeforces.com/contests/${contest.id}`
        }));
  
      // Return the array directly — no wrapping msg object
      return contests;
    } catch (err) {
      console.error('Codeforces fetch error:', err.message);
      return [];
    }
  }
  

module.exports = fetchCodeforcesContests;
