import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import { UserContext } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import DonorPanel from "./pages/DonorPanel";
import FoodMatchDisplay from "./pages/FoodMatchDisplay";
import DeliveryMap from "./pages/DeliveryMap";
import LiveDriverTracker from "./pages/LiveDriverTracker";
import Footer from "./components/Footer";

const socket = io("http://localhost:5000");

function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      socket.emit("join", user._id);
    }
    socket.on("requestStatus", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("requestStatus");
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, notifications }}>
      <Router>
        <div className="min-h-screen  text-white flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6">
            <Notification />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/ngo" element={<NgoDashboard />} />
              <Route path="/approve" element={<DonorPanel />} />
              <Route path="/match" element={<FoodMatchDisplay />} />
              <Route path="/map" element={<DeliveryMap/>} />
              <Route
                path="/driver"
                element={
                  <LiveDriverTracker
                    donorId="donor123"
                    ngoId="ngo456"
                  />
                }
              />
            </Routes>
          </main>
          <Footer/>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
