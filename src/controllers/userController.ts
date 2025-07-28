import { Request, Response, NextFunction } from 'express';
import { getAllUsers } from '../service/userService/userService';
import { registerUserService } from '../models/userModel';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'User registration failed',
      error: err,
    });
    next(err);
  }
}
