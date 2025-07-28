import { pool } from "../config/db";
import { User } from "../types/types";

export const getAllUsersService = async (): Promise<User[]> => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

export const getUserByIdService = async (id: string): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const createUserService = async (userData: {
  name: string;
  email: string;
}): Promise<User> => {
  if (!userData.name || !userData.email) {
    throw new Error("Name and email are required");
  }
  const { name, email } = userData;
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
};

export const updateUserService = async (
  id: string,
  userData: { name: string; email: string }
): Promise<User | null> => {
  const { name, email } = userData;
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );
  return result.rows[0];
};

export const deleteUserService = async (id: string): Promise<User | null> => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
