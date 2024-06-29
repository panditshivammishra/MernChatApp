import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
console.log(process.env.MONGO_URI);
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
   
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};



