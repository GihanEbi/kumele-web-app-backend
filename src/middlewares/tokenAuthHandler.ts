import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { systemConfig } from "../config/systemConfig";

// Extend Express Request interface to include UserID
declare global {
  namespace Express {
    interface Request {
      UserID?: any;
      username?: string;
    }
  }
}

export const tokenAuthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const token = req.headers["authorization"]?.split(" ")[0]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, systemConfig.jwtSecret);
    if (
      !decoded ||
      typeof decoded !== "object" ||
      !("userId" in decoded) ||
      !decoded.userId
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.UserID = (decoded as jwt.JwtPayload).userId;
    req.username = (decoded as jwt.JwtPayload).username;
    next();
  } catch (error) {
    console.log(error);
    
    return res.status(401).json({ message: "Unauthorized" });
  }
};
