import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import serverless from "serverless-http";
import app from "../src/app";
import { connectDB } from "../src/config/db";
import { seedDatabaseIfEmpty } from "../src/seed/seedDatabase";

dotenv.config();

const handler = serverless(app);

let isReady = false;

export default async function api(req: VercelRequest, res: VercelResponse) {
  if (!isReady) {
    await connectDB();
    await seedDatabaseIfEmpty();
    isReady = true;
  }

  return handler(req, res);
}