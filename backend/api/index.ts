import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import app from "../src/app";
import { connectDB } from "../src/config/db";

const handler = serverless(app);

let connectionPromise: Promise<void> | null = null;

export default async function api(req: VercelRequest, res: VercelResponse) {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }

  await connectionPromise;

  return handler(req, res);
}