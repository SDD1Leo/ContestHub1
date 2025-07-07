import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to ContestHub</h1>
      <p className="text-lg text-gray-300 mb-8">
        Discover and track upcoming coding contests from various platforms!
      </p>
      <button
        onClick={() => navigate("/login")}
        className="bg-primary hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition duration-200"
      >
        Login
      </button>
    </div>
  );
}

export default Home;
