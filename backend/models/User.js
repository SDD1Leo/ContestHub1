const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  platformHandles: {
    codeforces: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    codechef: { type: String, default: '' }
  },

  ratings: {
    codeforces: { type: Number, default: null },
    leetcode: {
      rating: { type: Number, default: null },
      topPercentage: { type: Number, default: null }
    },
    codechef: {
      rating: { type: Number, default: null },
      stars: { type: String, default: '' },
      highestRating: { type: Number, default: null }
    },
    lastFetched: { type: Date, default: null }
  },
  friends: [{ type: String }], // array of user email addresses

  bookmarkedContests: [{
    contestId: String,
    name: String,
    platform: String,
    startTime: Date,
    url: String,
    notifyAt: Date,
    notified: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('User', userSchema);
