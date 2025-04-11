import { GoogleGenerativeAI } from "@google/generative-ai";
import foodmodel from "../models/Food.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const matchFoodRequest = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Fetch all available food items
    const availableFood = await foodmodel.find({ status: "available" });

    if (availableFood.length === 0) {
      return res.status(404).json({ message: "No available food donations at the moment." });
    }

    // Convert food items to a readable format
    const foodList = availableFood.map(food => ({
      id: food._id,
      type: food.foodType,
      quantity: food.quantity,
      expiry: food.expiryDate,
      location: food.location
    }));

    // Create AI prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const aiPrompt = `
      You are an AI that helps NGOs find the best food donations for their needs.
      Given this NGO request: "${prompt}"
      And these available food donations: ${JSON.stringify(foodList)}
      Suggest the top 3 best matching food items with a brief reason for each match.
    `;

    const response = await model.generateContent(aiPrompt);
    const aiSuggestion = response.response.text(); // Extract AI response

    res.status(200).json({ matches: aiSuggestion });

  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ message: "AI matching failed. Try again later." });
  }
};
