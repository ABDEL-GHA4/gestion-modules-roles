import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../models/User";

type JwtPayload = {
  id: number;
  role: UserRole;
};

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "development_secret_key";
    req.user = jwt.verify(token, jwtSecret) as JwtPayload;
    next();
  } catch {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export const authorize = (...roles: UserRole[]): RequestHandler => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};
