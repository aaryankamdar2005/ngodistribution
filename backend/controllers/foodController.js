import foodmodel from "../models/Food.js";
import usermodel from "../models/User.js";

const addFood = async (req, res) => {
    try {
      const { foodType, quantity, expiryDate, location } = req.body;
      console.log(req.user._id);
  
      const newFood = await foodmodel.create({
        donorId: req.user.userId,
        foodType,
        quantity,
        expiryDate,
        location,
      });
  
      // ✅ Use global `io` instead of `req.io`
      const io = req.app.get("io");
  
      // ✅ Ensure `io` exists before emitting
      if (io) {
        io.emit("newDonation", {
          foodId: newFood._id,
          foodType,
          quantity,
          expiryDate,
          location,
          donorId: req.user.userId,
        });
      } else {
        console.error("Socket.io instance not found");
      }
  
  
      res.status(201).json({ message: "Food added successfully", food: newFood });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
const getAvailableFood = async(req,res)=>{

    try {

         const list= await foodmodel.find({status:"available"}).populate("donorId","name location");
         res.status(200).json(list);

    }
    catch(error) {
    res.status(500).json({message:error.message})
    }
}
const claimFood = async(req,res)=>{
    try {
const foodId = req.params.foodId;
const food = await foodmodel.findById(foodId);



if(food===null || food.status!=="available") {
    return res.status(404).json({ message: "Food not available" });
}
food.status ="claimed";
await food.save();
res.json({ message: "Food claimed successfully" });

    }
    catch(error) {
        res.status(500).json({message:error.message})
    }
}


export {addFood,getAvailableFood,claimFood};

