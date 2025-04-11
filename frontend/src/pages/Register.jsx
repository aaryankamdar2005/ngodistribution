import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/user/register", {
        name,
        email,
        password,
        role,
        phone,
        location: { latitude, longitude },
      });
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => setError("Location access denied. Please enter manually.")
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-300 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="donor">Donor</option>
            <option value="receiver">Receiver</option>
          </select>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Latitude"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Longitude"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
          <button
            type="button"
            onClick={getLocation}
            className="w-full py-3 rounded-md text-black font-semibold border-1 transition"
          >
            Get Current Location
          </button>
          <button
            type="submit"
            className="w-full py-3 rounded-md  text-black font-semibold border-1 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
