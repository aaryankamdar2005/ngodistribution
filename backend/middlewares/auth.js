import jwt from 'jsonwebtoken';
import { exp } from 'mathjs';
import dotenv from "dotenv";
dotenv.config();




const auth = async(req,res,next)=> {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Kindly login or register" });
      }
      try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; 
        next();
      } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
      }
};
export default auth;

