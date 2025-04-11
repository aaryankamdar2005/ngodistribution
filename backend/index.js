import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDb from "./config/dbconnect.js";

import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import { matchFoodRequest } from "./controllers/aiController.js";

dotenv.config();
connectDb();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

app.set("io", io);

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const connectedUsers = {};
const activeDeliveries = {}; // deliveryId -> { location, donorLocation, ngoLocation }

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("join", (userId) => {
    connectedUsers[userId] = socket.id;
    socket.data.userId = userId;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });
  setTimeout(() => {
    socket.emit("startDelivery", {
      deliveryId: "test-123",
      donorloc: "test-donor-loc",
      ngoloc: "test-ngo-loc",
    });
  }, 3000);
  
  // Called when a new delivery is created or assigned
 

  // Update delivery location during transit
  socket.on("updateDeliveryLocation", ({ deliveryId, location }) => {
    if (!activeDeliveries[deliveryId]) {
      console.warn(`No delivery found with ID ${deliveryId}`);
      return;
    }

    activeDeliveries[deliveryId].location = location;

    const { donorLocation, ngoLocation } = activeDeliveries[deliveryId];

    io.emit("deliveryTracking", {
      deliveryId,
      location,
      donorLocation,
      ngoLocation,
    });
  });

  socket.on("foodHandedOver", ({ deliveryId, riderId }) => {
    io.emit("foodStatusUpdate", { deliveryId, status: "Food handed over to rider" });
  });

  socket.on("disconnect", () => {
    const { userId } = socket.data;
    if (userId && connectedUsers[userId]) {
      delete connectedUsers[userId];
      console.log(`User ${userId} disconnected`);
    }
  });
});

app.use("/user", authRoutes);
app.use("/food", foodRoutes);
app.use("/api", requestRoutes);
app.post("/aimatch", matchFoodRequest);

server.listen(5000, () => {
  console.log("Server started on port 5000");
});
