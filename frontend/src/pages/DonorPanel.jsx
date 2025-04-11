import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { io } from "socket.io-client";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeliveryMap from "./DeliveryMap"; // adjust path if needed

function DonorPanel() {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [socket, setSocket] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newSocket = io("ws://localhost:5000", {
        transports: ["websocket"],
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("WebSocket connected");
        newSocket.emit("join", user?._id);
      });

      newSocket.on("requestapproved", ({ foodId, foodtype, quantity }) => {
        toast.success(`Request approved: ${foodtype} (Qty: ${quantity})`, {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        });
      });

      newSocket.on("startDelivery", ({ deliveryId, donorLocation, ngoLocation }) => {
        console.log("📦 Delivery started:", deliveryId);

        const donorLatLng = {
          lat: donorLocation.latitude,
          lng: donorLocation.longitude,
        };

        const ngoLatLng = {
          lat: ngoLocation.latitude,
          lng: ngoLocation.longitude,
        };

        setRouteInfo({ deliveryId, donorLocation: donorLatLng, ngoLocation: ngoLatLng });
      });

      setSocket(newSocket);
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (socket) socket.disconnect();
    };
  }, [user]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/display", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/approve/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data || !response.data.message) {
        throw new Error("Unexpected response from server");
      }

      alert("Request approved successfully!");
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error approving request:", error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-800">
      <ToastContainer />
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center text-black mb-6"
      >
        Donor Panel
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-300"
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Pending Requests</h3>
        <ul className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <motion.li
                key={request._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center shadow-sm border border-gray-300"
              >
                <div>
                  <h4 className="text-lg font-semibold text-blue-700">
                    {request?.food?.foodType || "Unknown Food"}
                  </h4>
                  <p className="text-gray-600">
                    Requested by:{" "}
                    <span className="font-medium">
                      {request?.ngo?.name || "Unknown NGO"}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Status:{" "}
                    <span className="font-semibold text-yellow-600">
                      {request?.status}
                    </span>
                  </p>
                </div>
                {request.status === "pending" && (
                  <button
                    onClick={() => handleApproveRequest(request._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 shadow-sm"
                  >
                    Approve
                  </button>
                )}
              </motion.li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No pending requests at the moment.</p>
          )}
        </ul>
      </motion.div>

      {routeInfo?.donorLocation && routeInfo?.ngoLocation && (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-300">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Live Delivery Route</h3>
          <DeliveryMap
            donorLocation={routeInfo.donorLocation}
            ngoLocation={routeInfo.ngoLocation}
            deliveryId={routeInfo.deliveryId}
          />
        </div>
      )}
    </div>
  );
}

export default DonorPanel;
