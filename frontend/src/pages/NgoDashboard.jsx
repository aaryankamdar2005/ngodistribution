import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NgoDashboard() {
  const { user } = useContext(UserContext);
  const [foodListings, setFoodListings] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("ws://localhost:5000", { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("WebSocket connected successfully");
    });

    newSocket.on("newDonation", (food) => {
      setFoodListings((prev) => [...prev, food]);

      toast.success(
        `New Food Donation: ${food.foodType} (Qty: ${food.quantity}) (Exp: ${new Date(
          food.expiryDate
        ).toLocaleDateString()})`,
        {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        }
      );
    });

    newSocket.on("requestStatus", ({ message }) => {
      toast.info(message, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    });

    return () => newSocket.close();
  }, []);

  const fetchFoodListings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/food/available", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setFoodListings(data);
    } catch (error) {
      console.error("Error fetching food listings:", error.message);
    }
  };

  useEffect(() => {
    fetchFoodListings();
  }, []);

  const claimFood = async (foodId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/apply/${foodId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Food request submitted successfully!", {
        theme: "light",
      });
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        theme: "light",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-gray-800 mb-6">NGO Dashboard</h2>

      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-2xl text-gray-700 font-semibold mb-4">Available Food Listings</h3>

        <ul className="space-y-4">
          {foodListings.length > 0 ? (
            foodListings.map((food) => (
              <li
                key={food._id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-300"
              >
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{food.foodType}</h4>
                  <p className="text-gray-600">Quantity: {food.quantity}</p>
                  <p className="text-gray-600">
                    Expires: {new Date(food.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => claimFood(food._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow transition duration-300"
                >
                  Claim Food
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No available food listings at the moment.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default NgoDashboard;
