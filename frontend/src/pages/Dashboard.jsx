import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [contests, setContests] = useState([]);
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarked, setBookmarked] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { token , API } = useAuth();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        //const token = localStorage.getItem("token");
        const res = await fetch(
          `${API}/api/contests/dbcontest`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setContests(data);
      } catch (err) {
        console.error("Error fetching contests:", err);
        setContests([]);
      }
    };

    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${API}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data?.user?.bookmarkedContests) {
          const ids = data.user.bookmarkedContests.map((c) => c.contestId);
          setBookmarked(ids);
        } else {
          setBookmarked([]);
        }
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setBookmarked([]);
      }
    };

    fetchContests();
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = async (contest) => {
    const token = localStorage.getItem("token");
    const isBookmarked = bookmarked.includes(contest.contestId);

    try {
      const endpoint = isBookmarked
        ? `${API}/api/user/unbookmark`
        : `${API}/api/user/bookmark`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contest),
      });

      const data = await res.json();
      if (res.ok) {
        if (isBookmarked) {
          setBookmarked((prev) =>
            prev.filter((id) => id !== contest.contestId)
          );
          toast.success("Unbookmarked");
        } else {
          setBookmarked((prev) => [...prev, contest.contestId]);
          toast.success("Bookmarked");
        }
      } else {
        toast.error(data?.msg || "Error updating bookmark");
      }
    } catch (err) {
      toast.error("Bookmark request failed");
    }
  };

  const filteredContests = contests.filter((contest) => {
    const matchesPlatform =
      filterPlatform === "All" || contest.platform === filterPlatform;
    const matchesSearch = contest.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6 dark">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-red-500">Upcoming Contests</h2>

          {/* Mobile Hamburger */}
          <div className="relative md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-2xl focus:outline-none"
            >
              ☰
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 rounded shadow-lg w-36">
                <button
                  onClick={() => {
                    window.location.href = "/profile";
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex md:flex-row gap-2">
            <button
              onClick={() => {
                window.location.href = "/profile";
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white transition"
            >
              Profile
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="All">All Platforms</option>
            <option value="Codeforces">Codeforces</option>
            <option value="LeetCode">LeetCode</option>
            <option value="CodeChef">CodeChef</option>
          </select>

          <input
            type="text"
            placeholder="Search contests by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <ul className="space-y-4">
          {filteredContests.length === 0 && (
            <p className="text-gray-400 italic">No contests found.</p>
          )}

          {filteredContests.map((contest, idx) => (
            <li
              key={idx}
              className="bg-gray-800 p-4 rounded-md border border-gray-700 hover:border-red-500 transition relative"
            >
              <h3 className="text-xl font-semibold text-red-400">
                {contest.name}
              </h3>
              <p className="text-sm text-gray-400 mb-1">({contest.platform})</p>
              <p className="text-gray-300">
                Starts at:{" "}
                <span className="font-mono">
                  {new Date(contest.startTime).toLocaleString()}
                </span>
              </p>
              <p className="text-gray-300">
                Duration:{" "}
                <span className="font-mono">
                  {(contest.duration / 60).toFixed(2)} minutes
                </span>
              </p>
              <a
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-redcustom hover:underline"
              >
                🔗 Contest Link
              </a>

              {/* ✅ Bookmark Button */}
              <button
                onClick={() => handleBookmarkToggle(contest)}
                className={`absolute top-4 right-4 text-xl transition-transform transform hover:scale-125 ${
                  bookmarked.includes(contest.contestId)
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
                title={
                  bookmarked.includes(contest.contestId)
                    ? "Unbookmark"
                    : "Bookmark"
                }
              >
                {bookmarked.includes(contest.contestId) ? "♥" : "♡"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
