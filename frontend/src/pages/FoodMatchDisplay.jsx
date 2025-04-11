import React, { useState } from "react";
import axios from "axios";

const FoodMatchDisplay = () => {
  const [prompt, setPrompt] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMatchRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/aimatch", { prompt });
  console.log(response);
      let matchText = response.data.matches || ""; // Get the response string
  
      // Regular expression to extract structured data (id, type, quantity)
      const regex = /`id: (\w+)`, type: "([^"]+)", quantity: "([^"]+)"/g;
      let extractedMatches = [];
      let match;
  
      while ((match = regex.exec(matchText)) !== null) {
        extractedMatches.push({
          id: match[1],
          foodType: match[2],
          quantity: match[3],
        });
      }
  
      setMatches(extractedMatches); // Set structured data as an array
    } catch (err) {
      setError("Error fetching AI-matched food items. Please try again.");
    }
    setLoading(false);
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Matching Food Donations</h2>
      
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="4"
        placeholder="Enter your food requirements (e.g., wheat, rice, milk)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>

      <button
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
        onClick={handleMatchRequest}
        disabled={loading}
      >
        {loading ? "Searching..." : "Find Matches"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      
      {matches.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Matching Food Items:</h3>
          <ul>
            {Array.isArray(matches) ? matches.map((item, index) => (
              <li key={index} className="p-3 border-b text-gray-700">
                <strong>{item.foodType}</strong> - {item.quantity} ({item.expiryDate})
              </li>
            )) : <p>No matching items found.</p>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FoodMatchDisplay;
