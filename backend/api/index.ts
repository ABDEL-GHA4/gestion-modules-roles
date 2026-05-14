import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import { connectDB } from "../src/config/db";

let dbPromise: Promise<void> | null = null;

const ensureDB = async (): Promise<void> => {
  if (!dbPromise) {
    dbPromise = connectDB();
  }

  await dbPromise;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("[API]", req.method, req.url);

    await ensureDB();

    return app(req, res);
  } catch (error) {
    console.error("[API ERROR]", error);

    const message = error instanceof Error ? error.message : "Server error";

    return res.status(500).json({
      message
    });
  }
}