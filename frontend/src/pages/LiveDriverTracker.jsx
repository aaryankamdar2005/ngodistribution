import { useEffect } from "react";
import { io } from "socket.io-client";

const LiveDriverTracker = ({ donorId, ngoId }) => {
  const deliveryId = `${donorId}-${ngoId}`;

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.emit("join", deliveryId);

    // Simulated movement within Pune
    let lat = 18.5204;
    let lng = 73.8567;

    const emitLocation = () => {
      socket.emit("updateDeliveryLocation", {
        deliveryId,
        location: { lat, lng },
      });

      // Simulate slight movement
      lat += (Math.random() - 0.5) * 0.001;
      lng += (Math.random() - 0.5) * 0.001;
    };

    emitLocation();
    const intervalId = setInterval(emitLocation, 5000);

    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, [deliveryId]);

  return (
    <div className="bg-green-100 text-green-800 p-3 rounded shadow">
      <p>Live driver tracking is active...</p>
    </div>
  );
};

export default LiveDriverTracker;
// to update 

