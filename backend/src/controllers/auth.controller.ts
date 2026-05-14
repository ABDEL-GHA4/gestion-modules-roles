import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

type LoginBody = {
  username?: string;
  password?: string;
};

type SafeUser = {
  [key: string]: unknown;
  password?: string;
  _id?: unknown;
  __v?: unknown;
};

export const login: RequestHandler = async (req, res, next) => {
  const startedAt = Date.now();

  try {
    const { username, password } = req.body as LoginBody;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    console.log("[LOGIN] Start:", username);

    const user = await User.findOne({ username }).maxTimeMS(8000).lean<SafeUser>();

    console.log("[LOGIN] User query done in:", Date.now() - startedAt, "ms");

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const storedPassword = String(user.password || "");

    let isValidPassword = false;

    if (
      storedPassword.startsWith("$2a$") ||
      storedPassword.startsWith("$2b$") ||
      storedPassword.startsWith("$2y$")
    ) {
      isValidPassword = bcrypt.compareSync(password, storedPassword);
    } else {
      isValidPassword = password === storedPassword;
    }

    console.log("[LOGIN] Password check done in:", Date.now() - startedAt, "ms");

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || "development_secret_key";

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      jwtSecret,
      {
        expiresIn: "7d"
      }
    );

    const { password: _password, _id: _mongoId, __v: _version, ...safeUser } = user;

    res.json({
      token,
      user: safeUser
    });
  } catch (error) {
    console.error("[LOGIN] Error:", error);
    next(error);
  }
};