import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [serverAwake, setServerAwake] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      const startTime = Date.now();
      let isAwake = false;

      while (!isAwake && Date.now() - startTime < 60000) {
        try {
          const res = await fetch("https://contesthub1-server.onrender.com/api/user/ping", {
            method: "GET",
            cache: "no-store",
          });

          if (res.ok) {
            isAwake = true;
            setServerAwake(true);
            break;
          }
        } catch (err) {
          // Server still sleeping
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      setChecking(false);
    };

    checkServer();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to ContestHub</h1>
      <p className="text-lg text-gray-300 mb-8">
        Discover and track upcoming coding contests from various platforms!
      </p>

      <button
        onClick={() => navigate("/login")}
        disabled={!serverAwake}
        className={`${
          serverAwake ? "bg-primary hover:bg-red-600" : "bg-gray-600 cursor-not-allowed"
        } text-white font-semibold py-2 px-6 rounded transition duration-200 flex items-center gap-2`}
      >
        {!serverAwake ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Please wait... Initializing server
          </>
        ) : (
          "Login"
        )}
      </button>
    </div>
  );
}

export default Home;
