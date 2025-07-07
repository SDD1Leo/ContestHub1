const axios = require('axios');

async function fetchLeetcodeContests() {
  try {
    const graphqlQuery = {
      query: `
        query getContestList {
          allContests {
            title
            startTime
            duration
            titleSlug
          }
        }
      `
    };
    
    const response = await axios.post('https://leetcode.com/graphql', graphqlQuery, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/contest/',
        'Origin': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    // console.log('LeetCode raw response:', JSON.stringify(response.data, null, 2)); // 👈 helps confirm response shape

    const allContests = response.data.data.allContests;
    const now = Date.now();

    const activeContests = allContests
      .filter(contest => contest.startTime * 1000 > now)
      .map(contest => ({
        platform: 'LeetCode',
        name: contest.title,
        startTimeUnix: contest.startTime,
        startTime: new Date(contest.startTime * 1000).toISOString(),
        durationSeconds: contest.duration,
        duration: `${Math.floor(contest.duration / 3600)} hours ${(contest.duration % 3600) / 60} minutes`,
        url: `https://leetcode.com/contest/${contest.titleSlug}`
      }));

    return activeContests;
  } catch (error) {
    console.error('LeetCode fetch error:', error.message); // 👈 log exact error
    return [];
  }
}

module.exports = fetchLeetcodeContests;
