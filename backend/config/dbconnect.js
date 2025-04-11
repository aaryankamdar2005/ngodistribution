import mongoose from "mongoose"; 

const connectDb = async () => {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
    } catch (error) {
        console.error(" MongoDB connection error:", error);
        process.exit(1); 
    }
};

export default connectDb; 
