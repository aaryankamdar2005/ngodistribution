import usermodel from "../models/User.js";
import bcrypt from 'bcryptjs'; 
import dotenv from "dotenv";
dotenv.config();

import jwt from 'jsonwebtoken';

const registerUser = async(req,res) => {

    const {name,email,password,role,phone,location}=req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await usermodel.create({
            name,
            email,
        password:hashedPassword,
            role,
            phone,
            location
        });


        return res.status(500).json({message:"registeration successfull"});
    }
    catch(error) {
        return res.status(500).json({message:error.message});
    }
   
}

const loginUser = async(req,res)=> {
    try {

        const { email,password} = req.body;
        const user = await usermodel.findOne({email});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
          }
         
          const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
          const role=user.role;
          res.json({ token,role});
    }
    catch(error) {
        return res.status(500).json({message:error.message});
    }
}
export  {registerUser,loginUser};
