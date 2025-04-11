import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("deliveryTracking", ({ deliveryId, location, donorLocation, ngoLocation }) => {
      setCurrentDelivery({ deliveryId, donorLocation, ngoLocation });
    });

    return () => {
      socket.off("deliveryTracking");
    };
  }, []);

  const handleTrackNGO = () => {
    
      navigate("/map");
    
    
    
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-lime-500 via-emerald-500 to-green-600 text-transparent bg-clip-text">
            Food Redistribution
          </h1>
          <button
            className="text-gray-700 md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Right: Nav items */}
        <div className="hidden md:flex items-center justify-center space-x-6  text-sm font-medium">
          <Link to="/" className="text-gray-700 hover:text-green-600 transition">Home</Link>
          <Link to="/match" className="text-gray-700 hover:text-green-600 transition">Match</Link>
          <button
            onClick={handleTrackNGO}
            className="text-gray-700" 
          >
            Track Rider
          </button>
          <Link to="/donor" className="text-gray-700 hover:text-green-600 transition">Donor Dashboard</Link>
          <Link to="/ngo" className="text-gray-700 hover:text-green-600 transition">NGO Dashboard</Link>
          <Link to="/approve" className="text-gray-700 hover:text-green-600 transition">Approvals</Link>

          {user ? (
            <button
              onClick={() => setUser(null)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg transition">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg transition">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav items */}
      {isOpen && (
        <div className="md:hidden w-full justify-center items-center mt-4 flex flex-col space-y-2 text-lg font-medium">
          <Link to="/" className="text-gray-700 hover:text-green-600 transition">Home</Link>
          <Link to="/match" className="text-gray-700 hover:text-green-600 transition">Match</Link>
        
          <Link to="/donor" className="text-gray-700 hover:text-green-600 transition">Donor Dashboard</Link>
          <Link to="/ngo" className="text-gray-700 hover:text-green-600 transition">NGO Dashboard</Link>
          <Link to="/approve" className="text-gray-700 hover:text-green-600 transition">Approvals</Link>

          {user ? (
            <button
              onClick={() => setUser(null)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg transition">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg transition">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
