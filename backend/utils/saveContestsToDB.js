const Contest = require('../models/Contest');
const slugify = require('slugify');

// Convert "2 hours", "90 minutes", etc. to seconds
function parseDurationToSeconds(durationStr) {
  if (typeof durationStr === 'number') return durationStr;

  let total = 0;
  const hourMatch = durationStr.match(/(\d+)\s*hours?/i);
  const minuteMatch = durationStr.match(/(\d+)\s*minutes?/i);

  if (hourMatch) total += parseInt(hourMatch[1]) * 3600;
  if (minuteMatch) total += parseInt(minuteMatch[1]) * 60;

  const fallback = parseInt(durationStr);
  return isNaN(fallback) ? 0 : fallback;
}

async function saveContestsToDB(contests) {
  // 🧹 Step 1: Remove past contests
  try {
    const now = new Date();
    const result = await Contest.deleteMany({ endTime: { $lt: now } });
    console.log(`🧹 Removed ${result.deletedCount} past contests.`);
  } catch (err) {
    console.error('❌ Error removing old contests:', err.message);
  }

  let savedCount = 0;

  // 📝 Step 2: Insert upcoming contests
  for (const contest of contests) {
    try {
      const duration = parseDurationToSeconds(contest.durationSeconds || contest.duration);
      const startTime = new Date(contest.startTime);
      const startTimeUnix = contest.startTimeUnix || Math.floor(startTime.getTime() / 1000);
      const endTime = contest.endTime
        ? new Date(contest.endTime)
        : new Date(startTime.getTime() + duration * 1000);
      const contestId = `${slugify(contest.name, { lower: true })}-${startTimeUnix}`;

      const exists = await Contest.findOne({ platform: contest.platform, contestId });
      if (exists) {
        console.log(`⚠️ Skipped (duplicate): ${contest.name}`);
        continue;
      }

      await Contest.create({
        platform: contest.platform,
        contestId,
        name: contest.name,
        url: contest.url,
        startTime,
        startTimeUnix,
        duration,
        durationSeconds: duration,
        endTime,
        status: 'UPCOMING',
      });

      savedCount++;
      console.log(`✅ Inserted: ${contest.name}`);
    } catch (err) {
      console.error(`❌ Error inserting: ${contest.name}`, err.message);
    }
  }

  console.log(`🎯 Total contests saved: ${savedCount}`);
}

module.exports = saveContestsToDB;
