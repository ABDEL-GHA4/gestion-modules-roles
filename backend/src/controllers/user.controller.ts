import type { RequestHandler } from "express";
import User from "../models/User";

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await User.find().sort({ id: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
