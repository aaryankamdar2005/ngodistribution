import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DonorDashboard() {
  const [foodListings, setFoodListings] = useState([]);
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

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
    const socketConnection = io("http://localhost:5000");

    socketConnection.on("newDonation", (newDonation) => {
      if (newDonation) {
        toast.success(
          `New Donation Received!\nFood: ${newDonation.foodType}\nQuantity: ${newDonation.quantity}\nExpires: ${newDonation.expiryDate}`,
          {
            position: "top-right",
            autoClose: 5000,
            theme: "light",
          }
        );

        setFoodListings((prev) => [...prev, newDonation]);
      }
    });

    setSocket(socketConnection);
    fetchFoodListings();

    return () => {
      socketConnection.off("newDonation");
      socketConnection.close();
    };
  }, []);

  const handleAddFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/food/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodType,
          quantity,
          expiryDate,
          location: { latitude: 19.076, longitude: 72.8777 },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (socket) {
        socket.emit("newDonation", data);
      }

      toast.success("Food listing added successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });

      setFoodListings([...foodListings, data]);
      setFoodType("");
      setQuantity("");
      setExpiryDate("");
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full bg-gray-100 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800">Donor Dashboard</h2>

      <form onSubmit={handleAddFood} className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-2xl text-gray-700 mb-4">Add Food Listing</h3>

        <input
          type="text"
          placeholder="Food Type"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 placeholder-gray-500 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 placeholder-gray-500 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition duration-300"
        >
          {loading ? "Adding..." : "Add Food"}
        </button>
      </form>

      <h3 className="text-2xl text-gray-700 mt-8">Your Food Listings</h3>
      <ul className="mt-4 space-y-3">
        {foodListings.length > 0 ? (
          foodListings.map((food) => (
            <li
              key={food._id || food.foodId}
              className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
            >
              <h4 className="text-lg font-semibold text-gray-800">{food.foodType}</h4>
              <p className="text-gray-600">Quantity: {food.quantity}</p>
              <p className="text-gray-600">
                Expires on: {new Date(food.expiryDate).toLocaleDateString()}
              </p>
              <p
                className={`text-sm font-semibold ${
                  food.status === "available" ? "text-green-600" : "text-red-500"
                }`}
              >
                Status: {food.status}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No food listings added yet.</p>
        )}
      </ul>
    </div>
  );
}

export default DonorDashboard;
