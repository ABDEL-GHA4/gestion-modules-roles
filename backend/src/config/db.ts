import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Create backend/.env from backend/.env.example");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};
