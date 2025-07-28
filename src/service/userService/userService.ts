import { getAllUsersService } from "../../models/userModel";

export const getAllUsers = async () => {
  return await getAllUsersService();
};