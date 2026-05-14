import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Create backend/.env from backend/.env.example");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 5
    });
  }

  await connectionPromise;
  console.log("MongoDB connected");
};