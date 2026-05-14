import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

type LoginBody = {
  username?: string;
  password?: string;
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body as LoginBody;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || "development_secret_key";
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: "7d" });

    res.json({ token, user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};
