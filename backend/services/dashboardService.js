const fetchCodeforcesContests = require('./codeforcesFetcher');
const fetchLeetcodeContests = require('./leetcodeFetcher');
const fetchCodechefContests = require('./codechefFetcher');
const saveContestsToDB = require('../utils/saveContestsToDB');

async function fetchAllContests() {
  try {
    const [codeforces, leetcode, codechef] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetcodeContests(),
      fetchCodechefContests(),
    ]);

    const allContests = [...codeforces, ...leetcode, ...codechef];

    const upcoming = allContests
      .filter(contest => new Date(contest.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    // Save upcoming contests to DB
    await saveContestsToDB(upcoming);
    
    return upcoming;
  } catch (err) {
    console.error('Dashboard Fetch Error:', err.message);
    return [];
  }
}

module.exports = fetchAllContests;
