import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Profile() {
  const { token , API } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    codeforces: "",
    leetcode: "",
    codechef: "",
  });
  const [editing, setEditing] = useState(false);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("bookmarks");
  const [friendEmail, setFriendEmail] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [addingFriend, setAddingFriend] = useState(false);
  const [removingFriendEmail, setRemovingFriendEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProfile(data.user);
        setFormData(data.user?.platformHandles || {});
        setRatings(data.user?.ratings);
        
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFriends = async () => {
      try {
        const res = await fetch(`${API}/api/user/friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProfile((prev) => ({ ...prev, friendsData: data.friends }));
      } catch (err) {
        console.error("Failed to fetch friends", err);
      }
    };

    if (token) {
      fetchProfile();
      fetchFriends();
    }
  }, [token]);
  const fetchRatingsDb = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`${API}/api/user/ratings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data && data.ratings) {
        setRatings(data.ratings);
        toast.success("Ratings synced with latest handles!");
      } else {
        toast.warn("Failed to sync ratings");
      }
    } catch (err) {
      console.error("Error syncing ratings:", err);
      alert("❌ Something went wrong while syncing");
    } finally {
      setSyncing(false);
    }
  };

  const handleUnbookmark = async (contestId) => {
    try {
      const res = await fetch(`${API}/api/user/unbookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contestId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Contest unbookmarked");
        setProfile((prev) => ({
          ...prev,
          bookmarkedContests: prev.bookmarkedContests.filter(
            (c) => c.contestId !== contestId
          ),
        }));
      } else {
        toast.warn(data.msg || "Failed to unbookmark");
      }
    } catch (err) {
      console.error("Unbookmark error:", err);
      toast.error("Something went wrong");
    }
  };

  const addFriend = async (e) => {
    e.preventDefault();
    if (!friendEmail) return;

    try {
      setAddingFriend(true);
      const res = await fetch(`${API}/api/user/add-friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: friendEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.msg || "Friend added successfully!");
        setFriendEmail("");
        // Re-fetch the updated friend list
        const updatedFriends = await fetch(
          `${API}/api/user/friends`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedData = await updatedFriends.json();
        setProfile((prev) => ({ ...prev, friendsData: updatedData.friends }));
      } else {
        toast.warn(data.msg || "Could not add friend");
      }
    } catch (err) {
      toast.error("Error adding friend");
      console.error(err);
    } finally {
      setAddingFriend(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/user/update-handles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      toast.success(data.msg || "Updated!");
      //setProfile(data.user);
      setEditing(false);
    } catch (err) {
      toast.error("Error updating handles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d1117] text-white min-h-screen p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* 🔙 Go Back Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-600"
          >
            Dashboard
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-red-400">👤 Profile</h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <>
            {profile && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-gray-300">
                      Username:{" "}
                      <span className="text-white">{profile.username}</span>
                    </h3>
                    <p className="text-sm text-gray-400">
                      Email: {profile.email}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditing((prev) => !prev)}
                    className="text-sm px-4 py-1 bg-red-500 text-black rounded hover:bg-red-600"
                  >{loading ? 
                   <>
                   <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   </> 
                  :<>
                    {editing ? "Cancel" : "Edit Handles"}
                  </>
                  }
                  </button>
                </div>

                {editing && (
                  <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                    <input
                      className="w-full bg-gray-800 p-2 rounded"
                      placeholder="Codeforces Handle"
                      value={formData.codeforces || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, codeforces: e.target.value })
                      }
                    />
                    <input
                      className="w-full bg-gray-800 p-2 rounded"
                      placeholder="LeetCode Handle"
                      value={formData.leetcode || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, leetcode: e.target.value })
                      }
                    />
                    <input
                      className="w-full bg-gray-800 p-2 rounded"
                      placeholder="CodeChef Handle"
                      value={formData.codechef || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, codechef: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
                    >
                      Save
                    </button>
                  </form>
                )}

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-green-400">
                      Contest Ratings
                    </h3>
                    <button
                      onClick={() => fetchRatingsDb()}
                      disabled={syncing}
                      className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 flex items-center gap-2"
                    >
                      {syncing ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "🔄 Sync with Handles"
                      )}
                    </button>
                  </div>

                  <ul className="text-gray-300">
                    {ratings.codeforces && (
                      <li>
                        Codeforces:{" "}
                        <span className="text-white">{ratings.codeforces}</span>
                      </li>
                    )}
                    {ratings.leetcode &&
                    typeof ratings.leetcode === "object" ? (
                      <li>
                        LeetCode:{" "}
                        <span className="text-white">
                          {ratings.leetcode.rating}
                        </span>{" "}
                        (Top{" "}
                        <span className="text-white">
                          {ratings.leetcode.topPercentage}%
                        </span>
                        )
                      </li>
                    ) : (
                      <li>
                        LeetCode: <span className="text-white">N/A</span>
                      </li>
                    )}
                    {ratings.codechef &&
                    typeof ratings.codechef === "object" ? (
                      <li>
                        CodeChef:
                        <span className="text-white">
                          {" "}
                          {ratings.codechef.rating}
                        </span>
                        <span className="ml-2 text-yellow-400">
                          {ratings.codechef.stars}
                        </span>
                        <span className="text-gray-400 ml-2">
                          (Highest: {ratings.codechef.highestRating})
                        </span>
                      </li>
                    ) : (
                      <li>
                        CodeChef:{" "}
                        <span className="text-white">
                          {ratings.codechef || "N/A"}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Tab Buttons */}
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setActiveTab("bookmarks")}
                    className={`px-4 py-2 rounded border ${
                      activeTab === "bookmarks"
                        ? "border-red-500 text-black"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    📌
                  </button>
                  <button
                    onClick={() => setActiveTab("friends")}
                    className={`px-4 py-2 rounded border ${
                      activeTab === "friends"
                        ? "border-red-500 text-white"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    👥
                  </button>
                </div>

                {/* 📌 Bookmarked Contests */}
                {activeTab === "bookmarks" && (
                  <ul>
                    {profile.bookmarkedContests.map((contest, idx) => (
                      <li
                        key={idx}
                        className="bg-[#161b22] p-4 rounded border border-gray-700 hover:border-red-500 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg text-red-400 font-medium">
                              {contest.name}
                            </h4>
                            <p className="text-sm text-gray-400 mb-1">
                              ({contest.platform})
                            </p>
                            <p className="text-gray-300">
                              Starts at:{" "}
                              <span className="font-mono">
                                {new Date(contest.startTime).toLocaleString()}
                              </span>
                            </p>
                            <a
                              href={contest.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-2 text-blue-400 hover:underline"
                            >
                              🔗 View Contest
                            </a>
                          </div>
                          <button
                            onClick={() => handleUnbookmark(contest.contestId)}
                            className="text-red-500 hover:text-red-700 text-xl ml-4"
                          >
                            ✖
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* 👥 Friends Section */}
                {activeTab === "friends" && (
                  <div>
                    {/* 🆕 Add Friend Form */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-red-400 mb-2">
                        ➕ Add a Friend
                      </h3>
                      <form
                        onSubmit={(e) => addFriend(e)}
                        className="flex gap-3"
                      >
                        <input
                          type="email"
                          placeholder="Enter friend's email"
                          value={friendEmail}
                          onChange={(e) => setFriendEmail(e.target.value)}
                          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 flex-1"
                        />

                        <button
                          type="submit"
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          {addingFriend ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>Add</>
                          )}
                        </button>
                      </form>
                    </div>
                    <ul className="space-y-4">
                    {Array.isArray(profile.friendsData) && profile.friendsData.map((friend, index) => (
                        <li
                          key={index}
                          className="bg-[#161b22] p-4 rounded border border-gray-700"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h4 className="text-lg text-red-400 font-medium">
                                {friend.username}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {friend.email}
                              </p>
                            </div>
                            <button
                              onClick={async () => {
                                try {
                                  setAddingFriend(true);
                                  const res = await fetch(
                                    `${API}/api/user/remove-friend`,
                                    {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                      },
                                      body: JSON.stringify({
                                        email: friend.email,
                                      }),
                                    }
                                  );
                                  const data = await res.json();
                                  if (res.ok) {
                                    toast.success(data.msg);
                                    // Refresh list
                                    const res2 = await fetch(
                                      `${API}/api/user/friends`,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );
                                    const updated = await res2.json();
                                    setProfile((prev) => ({
                                      ...prev,
                                      friendsData: updated.friends,
                                    }));
                                  } else {
                                    toast.warn(data.msg);
                                  }
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Error removing friend");
                                } finally {
                                  setAddingFriend(false);
                                }
                              }}
                              className="text-xl text-red-400 hover:text-red-600"
                            >
                              ✖
                            </button>
                          </div>

                          <div className="text-gray-300 text-sm">
                            <p>
                              CF:{" "}
                              <span className="text-white">
                                {friend.platformHandles.codeforces || "N/A"}
                              </span>
                            </p>
                            <p>
                              LC:{" "}
                              <span className="text-white">
                                {friend.platformHandles.leetcode || "N/A"}
                              </span>
                            </p>
                            <p>
                              CC:{" "}
                              <span className="text-white">
                                {friend.platformHandles.codechef || "N/A"}
                              </span>
                            </p>
                          </div>

                          <div className="mt-2 text-sm text-green-300">
                            {friend.ratings.codeforces && (
                              <p>
                                Codeforces Rating:{" "}
                                <span className="text-white">
                                  {friend.ratings.codeforces}
                                </span>
                              </p>
                            )}
                            {friend.ratings.leetcode?.rating && (
                              <p>
                                LeetCode:{" "}
                                <span className="text-white">
                                  {friend.ratings.leetcode.rating}
                                </span>{" "}
                                (Top {friend.ratings.leetcode.topPercentage}%)
                              </p>
                            )}
                            {friend.ratings.codechef?.rating && (
                              <p>
                                CodeChef:{" "}
                                <span className="text-white">
                                  {friend.ratings.codechef.rating}
                                </span>
                                <span className="ml-2 text-yellow-400">
                                  {friend.ratings.codechef.stars}
                                </span>
                                <span className="ml-2 text-gray-400">
                                  (Highest:{" "}
                                  {friend.ratings.codechef.highestRating})
                                </span>
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
