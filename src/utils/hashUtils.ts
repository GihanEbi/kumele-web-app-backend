import bcrypt from 'bcrypt';
import { systemConfig } from '../config/systemConfig';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, systemConfig.bcryptSaltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
