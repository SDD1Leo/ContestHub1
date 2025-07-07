const fetch = require('node-fetch');

const userContestRankingInfoQuery = `
    query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
        }
    }
`;

const getLeetcodeRating = async (req, res) => {
  const { username } = req.params;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${username}/`, // Required
      },
      body: JSON.stringify({
        query: userContestRankingInfoQuery,
        variables: { username },
      }),
    });

    const json = await response.json();

    if (!json.data || !json.data.userContestRanking) {
      return res.json({ rating: 'N/A' });
    }

    const { rating, globalRanking, topPercentage } = json.data.userContestRanking;
    res.json({ rating, globalRanking, topPercentage });
  } catch (err) {
    console.error('Error fetching LeetCode rating:', err.message);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
};

module.exports = { getLeetcodeRating };