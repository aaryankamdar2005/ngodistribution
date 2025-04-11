import requestmodel from '../models/Request.js'; 
import foodmodel from '../models/Food.js';

const displayRequest = async (req,res) => {
  try {

    const list= await requestmodel.find({status:"pending"}).populate("food ngo");

    return res.status(200).json(list);

  }
  catch(error) {
    res.status(500).json({message:error.message})
  }
}
const applyForRequest = async (req, res) => {
    try {
        const { foodId } = req.params;
        const ngoId = req.user.userId;

        const food = await foodmodel.findById(foodId);
        if (!food) return res.status(404).json({ message: "Food not found" });

        const existing = await requestmodel.findOne({ food: foodId, ngo: ngoId });
        if (existing) return res.status(400).json({ message: "Request already exists" });

        const newRequest = new requestmodel({
            food: foodId,
            ngo: ngoId,
            donor: food.donorId,
            status: "pending",
        });

        await newRequest.save();

        // WebSocket Notification to Donor
        const io = req.app.get("io");
        const connectedUsers = req.app.get("connectedUsers");
        const donorSocketId = connectedUsers[food.donorId.toString()];
        
        if (donorSocketId) {
            io.to(donorSocketId).emit("newRequest", {
                message: "A new request has been made for your food item.",
                requestId: newRequest._id,
                foodName: food.foodType,
            });
        }

        res.status(201).json({ message: "Request submitted successfully", newRequest });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const approveRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
      const donorId = req.user.userId;
  
      const foodrequest = await requestmodel.findById(requestId).populate("food ngo donor");
      if (!foodrequest) return res.status(404).json({ message: "Request not found" });
  
      const food = await foodmodel.findById(foodrequest.food._id);
      food.status = "claimed";
      await food.save();
  
      foodrequest.status = "approved";
      await foodrequest.save();
  
      const io = req.app.get("io");
      const deliveryId = `${foodrequest.donor._id}-${foodrequest.ngo._id}`;
      const donorLocation = foodrequest.donor.location;
      const ngoLocation = foodrequest.ngo.location;

      if (io) {
        // Notify NGO (if needed)
        io.emit("requestapproved", {
          foodId: food._id,
          foodtype: food.foodType,
          quantity: food.quantity,
        });
  console.log(food._id)
  console.log(food.foodType)
  console.log(food.quantity);
        // Start delivery tracking
        if (donorLocation && ngoLocation) {
          io.emit("startDelivery", {
            deliveryId,
            donorLocation,
            ngoLocation,
          });
        } else {
          console.warn("Missing location info for donor or NGO");
        }
      }
  
      // ✅ Send final response to frontend
      res.status(200).json({ message: "Request approved successfully" });
  
    } catch (error) {
      console.error("Error approving request:", error);
      res.status(500).json({ message: error.message });
    }
  };
  

const rejectRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const donorId = req.user.userId;

        const foodrequest = await requestmodel.findById(requestId).populate("food ngo");
        if (!foodrequest) return res.status(404).json({ message: "Request not found" });

        if (foodrequest.donor.toString() !== donorId) {
            return res.status(403).json({ message: "Unauthorized: You are not the donor of this food item." });
        }

        foodrequest.status = "rejected";
        await foodrequest.save();

        // WebSocket Notification to NGO
        const io = req.app.get("io");
        const connectedUsers = req.app.get("connectedUsers");
        const ngoSocketId = connectedUsers[foodrequest.ngo._id.toString()];

        if (ngoSocketId) {
            io.to(ngoSocketId).emit("requestStatus", {
                message: `Your request for ${foodrequest.food.foodType} has been rejected.`,
                status: "rejected",
            });
        }

        res.status(200).json({ message: "Request rejected successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { applyForRequest, approveRequest, rejectRequest,displayRequest};
