const axios = require('axios');

const fetchRatings = async (handles) => {
  const results = {
    codeforces: null,
    leetcode: null,
    codechef: null,
  };

  // ✅ Codeforces Rating
  if (handles.codeforces) {
    try {
      const cfRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handles.codeforces}`);
      results.codeforces = cfRes.data.result[0].rating;
    } catch (err) {
      results.codeforces = 'N/A';
    }
  }

  // ✅ LeetCode Rating
  if (handles.leetcode) {
    try {
      const lcRes = await axios.get(`https://contesthub1-server-notify.onrender.com/api/fetch/leetcode/${handles.leetcode}`);

      if (lcRes.data && lcRes.data.rating) {
        results.leetcode = {
          rating: Math.round(lcRes.data.rating),
          topPercentage: lcRes.data.topPercentage,
        };
      } else {
        results.leetcode = 'Not rated yet';
      }
    } catch (err) {
      console.error('❌ Error fetching LeetCode rating:', err.response?.data || err.message);
      results.leetcode = 'N/A';
    }
  }

  // ✅ CodeChef Rating (via internal API)
  if (handles.codechef) {
    try {
      const ccRes = await axios.get(`https://contesthub1-server-notify.onrender.com/api/fetch/codechef/${handles.codechef}`);

      if (ccRes.data && ccRes.data.rating) {
        results.codechef = {
          rating: ccRes.data.rating,
          stars: ccRes.data.stars,
          highestRating: ccRes.data.highestRating,
        };
      } else {
        results.codechef = 'Not rated yet';
      }
    } catch (err) {
      console.error('❌ Error fetching CodeChef rating:', err.response?.data || err.message);
      results.codechef = 'N/A';
    }
  }

  return results;
};

module.exports = fetchRatings;
