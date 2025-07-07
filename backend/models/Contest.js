const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  platform: { type: String, required: true },        // e.g. 'codeforces'
  contestId: { type: String, required: true },       // unique contest id from platform
  name: { type: String, required: true },
  url: { type: String, required: true },

  startTime: { type: Date, required: true },
  startTimeUnix: { type: Number },                   // ✅ new (optional)

  duration: { type: Number, required: true },        // in seconds
  durationSeconds: { type: Number },                 // ✅ optional (some APIs give this explicitly)
  endTime: { type: Date, required: true },

  status: { type: String, required: true },          // 'UPCOMING', 'ONGOING', etc.

}, { timestamps: true });

contestSchema.index({ platform: 1, contestId: 1 }, { unique: true });

module.exports = mongoose.model('Contest', contestSchema);
