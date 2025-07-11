const User = require("../models/User");
const fetchRatings = require("../services/fetchRatings");
const Contest = require("../models/Contest");

const updateHandles = async (req, res) => {
  const { codeforces, leetcode, codechef } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        platformHandles: {
          codeforces,
          leetcode,
          codechef,
        },
      },
      { new: true }
    );
    res.json({ msg: "Handles updated", user });
  } catch (err) {
    res.status(500).json({ msg: "Error updating handles" });
  }
};

const getHandles = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile" });
  }
};

const getRatings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const ratings = user.ratings || {}; // ⬅️ Only extract the `ratings` part
    res.json({ ratings });
  } catch (err) {
    console.error("Error fetching ratings from DB:", err.message);
    res.status(500).json({ msg: "Error fetching ratings from database" });
  }
};

const bookmark = async (req, res) => {
  const { contestId, name, platform, startTime, url } = req.body;
  const notifyAt = new Date(new Date(startTime).getTime() - 10 * 60 * 1000); // 10 mins before

  try {
    const user = await User.findById(req.user.userId);

    const alreadyBookmarked = user.bookmarkedContests.some(
      (c) => c.contestId === contestId
    );
    if (alreadyBookmarked) {
      return res.status(400).json({ msg: "Already bookmarked" });
    }

    user.bookmarkedContests.push({
      contestId,
      name,
      platform,
      startTime,
      url,
      notifyAt,
    });
    await user.save();

    res.status(200).json({ msg: "Bookmarked successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Error bookmarking contest" });
  }
};

const unbookmark = async (req, res) => {
  const { contestId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { bookmarkedContests: { contestId } } },
      { new: true }
    );

    res.json({ msg: "Unbookmarked!" });
  } catch (err) {
    console.error("Error unbookmarking:", err);
    res.status(500).json({ msg: "Error unbookmarking" });
  }
};

const syncRatings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const handles = user.platformHandles;
    const ratings = await fetchRatings(handles);

    // Prepare final structure to store in MongoDB
    const updatedRatings = {
      codeforces:
        typeof ratings.codeforces === "number" ? ratings.codeforces : null,
      leetcode:
        typeof ratings.leetcode === "object"
          ? ratings.leetcode
          : { rating: null, topPercentage: null },
      codechef:
        typeof ratings.codechef === "object"
          ? {
              rating: ratings.codechef.rating || null,
              stars: ratings.codechef.stars || "",
              highestRating: ratings.codechef.highestRating || null,
            }
          : { rating: null, stars: "", highestRating: null },
      lastFetched: new Date(),
    };

    user.ratings = updatedRatings;
    await user.save();

    res
      .status(200)
      .json({ msg: "Ratings synced successfully!", ratings: updatedRatings });
  } catch (err) {
    console.error("Error syncing ratings:", err.message);
    res.status(500).json({ msg: "Failed to sync ratings" });
  }
};

const addFriend = async (req, res) => {
  const { email } = req.body;
  const userId = req.user.userId;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    // Check if target friend exists
    const friendUser = await User.findOne({ email });
    if (!friendUser) {
      return res.status(404).json({ msg: "No user found with this email" });
    }

    // Check if self-add
    if (friendUser._id.equals(userId)) {
      return res
        .status(400)
        .json({ msg: "You cannot add yourself as a friend" });
    }

    // Add to current user's friend list
    const user = await User.findById(userId);
    if (user.friends.includes(email)) {
      return res.status(400).json({ msg: "Friend already added" });
    }

    user.friends.push(email);
    await user.save();

    return res.status(200).json({ msg: "Friend added successfully" });
  } catch (err) {
    console.error("Error adding friend:", err.message);
    return res.status(500).json({ msg: "Server error while adding friend" });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.friends || user.friends.length === 0) {
      return res.json({ friends: [] });
    }

    const friendsData = await User.find(
      { email: { $in: user.friends } },
      "username email platformHandles ratings"
    );

    res.json({ friends: friendsData });
  } catch (err) {
    console.error("Error fetching friends:", err.message);
    res.status(500).json({ msg: "Failed to fetch friends" });
  }
};

const removeFriend = async (req, res) => {
  const { email } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: email } },
      { new: true }
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Friend removed successfully" });
  } catch (err) {
    console.error("Error removing friend:", err);
    res.status(500).json({ msg: "Error removing friend" });
  }
};

const ping = async(req,res) => {
  res.status(200).send("all good");
}

module.exports = {
  updateHandles,
  getHandles,
  getRatings,
  bookmark,
  unbookmark,
  syncRatings,
  addFriend,
  getFriends,
  removeFriend,
  ping,
};
