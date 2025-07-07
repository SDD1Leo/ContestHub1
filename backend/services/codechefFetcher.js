const axios = require('axios');

async function fetchCodechefContests() {
  try {
    const response = await axios.get('https://www.codechef.com/api/list/contests/all');
    const { future_contests } = response.data;

    const contests = future_contests.map(contest => ({
      platform: 'CodeChef',
      name: contest.contest_name,
      startTime: new Date(contest.contest_start_date_iso).toISOString(),
      startTimeUnix: new Date(contest.contest_start_date_iso).getTime() / 1000,
      duration: contest.contest_duration*60,
      url: `https://www.codechef.com/${contest.contest_code}`
    }));

    return contests;
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error.message);
    return [];
  }
}

module.exports = fetchCodechefContests;
