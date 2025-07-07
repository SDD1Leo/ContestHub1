const axios = require('axios');
const cheerio = require('cheerio');

const getCodechefRating = async (req, res) => {
  const { username } = req.params;

  try {
    const url = `https://www.codechef.com/users/${username}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const rating = $('.rating-number').first().text().trim();
    const stars = $('.rating-star').first().text().trim();
    const highestRating = $('.rating-header small').text().match(/\d+/)?.[0] || null;

    if (!rating) {
      return res.status(404).json({ error: 'Invalid CodeChef username or profile not found' });
    }

    res.json({
      rating,
      stars,
      highestRating,
    });

  } catch (err) {
    console.error('❌ Error fetching CodeChef rating:', err.message);
    res.status(500).json({ error: 'Failed to fetch CodeChef rating' });
  }
};

module.exports = { getCodechefRating };
