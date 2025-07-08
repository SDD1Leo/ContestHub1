const schedule = require('node-schedule');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

// Helper to schedule one notification
const scheduleSingleNotification = (user, contest) => {
  schedule.scheduleJob(new Date(contest.notifyAt), async () => {
    try {
      await sendEmail(user, contest);

      const userInDb = await User.findById(user._id);
      const target = userInDb.bookmarkedContests.find(
        (c) => c.contestId === contest.contestId
      );
      if (target) {
        target.notified = true;
        await userInDb.save();
      }

      console.log(`✅ Email sent to ${user.username} for contest: ${contest.name}`);
    } catch (err) {
      console.error(
        `❌ Failed to send email to ${user.username} for ${contest.name}:`,
        err.message
      );
    }
  });
};

// Main scheduler
const scheduleAllNotifications = async (req, res) => {
  try {
    const users = await User.find({});

    for (const user of users) {
      let hasUpdates = false;

      for (const contest of user.bookmarkedContests) {
        if (
          !contest.notified &&
          !contest.scheduled &&
          contest.notifyAt &&
          new Date(contest.notifyAt) > new Date()
        ) {
          scheduleSingleNotification(user, contest);
          contest.scheduled = true; // ✅ Mark as scheduled
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        await user.save();
      }
    }

    if (res) res.status(200).send("✅ All pending contest notifications scheduled.");
    console.log("✅ All pending contest notifications scheduled.");
  } catch (err) {
    console.error("❌ Error while scheduling notifications:", err.message);
    if (res) res.status(500).send("❌ Error while scheduling notifications.");
  }
};

module.exports = scheduleAllNotifications;
