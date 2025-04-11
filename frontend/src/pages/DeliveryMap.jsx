import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import axios from "axios";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const DeliveryMap = ({ ngoLocation, deliveryId }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    if (!ngoLocation?.lat || !ngoLocation?.lng) return;

    const newSocket = io("http://localhost:5000");
    newSocket.emit("join", deliveryId);

    newSocket.on("deliveryTracking", ({ deliveryId: incomingId, location }) => {
      if (incomingId !== deliveryId) return;
      const lat = location?.latitude ?? location?.lat;
      const lng = location?.longitude ?? location?.lng;
      if (lat && lng) {
        setDriverLocation({ lat, lng });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [ngoLocation, deliveryId]);

  const initialCenter = ngoLocation || { lat: 19.076, lng: 72.8777 };

  return (
    <div className="w-full h-[500px] mt-4 rounded-md shadow-md">
      <MapContainer center={initialCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ngoLocation && (
          <Marker position={[ngoLocation.lat, ngoLocation.lng]}>
            <Popup>NGO Location</Popup>
          </Marker>
        )}
        {driverLocation && (
          <Marker position={[driverLocation.lat, driverLocation.lng]}>
            <Popup>Driver Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;
// to update 