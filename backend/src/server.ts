import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { seedDatabaseIfEmpty } from "./seed/seedDatabase";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await seedDatabaseIfEmpty();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

void startServer();