const schedule = require('node-schedule');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Helper to schedule one notification
const scheduleSingleNotification = (user, contest) => {
  schedule.scheduleJob(new Date(contest.notifyAt), async () => {
    try {
      await sendEmail(user, contest); // ⬅️ Now passes full user (email inside)
      
      const userInDb = await User.findById(user._id); // Re-fetch user to avoid stale doc
      const target = userInDb.bookmarkedContests.find(c => c.contestId === contest.contestId);
      if (target) {
        target.notified = true;
        await userInDb.save();
      }

      console.log(`✅ Email sent to ${user.username} for contest: ${contest.name}`);
    } catch (err) {
      console.error(`❌ Failed to send email to ${user.username} for ${contest.name}:`, err.message);
    }
  });
};

// Main scheduler
const scheduleAllNotifications = async () => {
  try {
    const users = await User.find({});

    for (const user of users) {
      for (const contest of user.bookmarkedContests) {
        if (
          !contest.notified &&
          contest.notifyAt &&
          new Date(contest.notifyAt) > new Date()
        ) {
          scheduleSingleNotification(user, contest);
        }
      }
    }

    console.log("✅ All pending contest notifications scheduled.");
  } catch (err) {
    console.error("❌ Error while scheduling notifications:", err.message);
  }
};

module.exports = scheduleAllNotifications;
