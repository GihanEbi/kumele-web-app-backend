import { pool } from "../config/db";

const baseUrl = process.env.BASE_URL ?? "";

// function to follow a user
export const followUserService = async (
  following_id: string,
  follower_id: string
) => {
  // check if following_id and follower_id are provided
  if (!following_id || !follower_id) {
    return Promise.reject(
      new Error("Following ID and Follower ID are required")
    );
  }
  // check if the user is trying to follow themselves
  if (following_id === follower_id) {
    return Promise.reject(new Error("You cannot follow yourself"));
  }

  // check if the following user exists
  const followingCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    following_id,
  ]);
  if (followingCheck.rows.length === 0) {
    return Promise.reject(new Error("User to follow not found"));
  }
  // check if the follower user exists
  const followerCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    follower_id,
  ]);
  if (followerCheck.rows.length === 0) {
    return Promise.reject(new Error("Follower user not found"));
  }
  // check if the following relationship already exists
  const relationCheck = await pool.query(
    `SELECT * FROM following_follower WHERE following_id = $1 AND follower_id = $2`,
    [following_id, follower_id]
  );
  if (relationCheck.rows.length > 0) {
    return Promise.reject(new Error("You are already following this user"));
  }

  try {
    const query = `
      INSERT INTO following_follower (following_id, follower_id)
      VALUES ($1, $2)
    `;
    await pool.query(query, [following_id, follower_id]);
    return { message: "User followed successfully" };
  } catch (error) {
    console.error("Error following user:", error);
  }
};

// function to unfollow a user
export const unfollowUserService = async (
  following_id: string,
  follower_id: string
) => {
  // check if following_id and follower_id are provided
  if (!following_id || !follower_id) {
    return Promise.reject(
      new Error("Following ID and Follower ID are required")
    );
  }

  // check if the user is trying to unfollow themselves
  if (following_id === follower_id) {
    return Promise.reject(new Error("You cannot unfollow yourself"));
  }

  // check if the following relationship exists
  const relationCheck = await pool.query(
    `SELECT * FROM following_follower WHERE following_id = $1 AND follower_id = $2`,
    [following_id, follower_id]
  );
  if (relationCheck.rows.length === 0) {
    return Promise.reject(new Error("You are not following this user"));
  }

  try {
    const query = `
      DELETE FROM following_follower WHERE following_id = $1 AND follower_id = $2
    `;
    await pool.query(query, [following_id, follower_id]);
    return { message: "User unfollowed successfully" };
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
};

// function to get followers of a user
export const getFollowersService = async (user_id: string) => {
  if (!user_id) {
    return Promise.reject(new Error("User ID is required"));
  }

  try {
    const result = await pool.query(
      `
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', u.id,
          'username', u.username,
          'profilePicture', $2 || replace(u.profilepicture, '\\', '/'),
          'followedAt', ff.created_at
        )
      ) AS followers
      FROM following_follower ff
      JOIN users u ON ff.follower_id = u.id
      WHERE ff.following_id = $1
      `,
      [user_id, baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error getting followers:", error);
    throw new Error("Error getting followers");
  }
};

// function to get following of a user
export const getFollowingService = async (user_id: string) => {
  if (!user_id) {
    return Promise.reject(new Error("User ID is required"));
  }
  try {
    const query = `
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', u.id,
          'username', u.username,
          'profilePicture', $2 || replace(u.profilepicture, '\\', '/'),
          'followedAt', ff.created_at
        )
      ) AS following
      FROM following_follower ff
      JOIN users u ON ff.following_id = u.id
      WHERE ff.follower_id = $1
    `;

    const result = await pool.query(query, [
      user_id,
      baseUrl.endsWith("/") ? baseUrl : baseUrl + "/",
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error getting following:", error);
    throw new Error("Error getting following");
  }
};

// function to get count of followers and following of a user
export const getFollowersFollowingCountService = async (user_id: string) => {
  if (!user_id) {
    return Promise.reject(new Error("User ID is required"));
  }
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM following_follower WHERE following_id = $1) AS followers_count,
        (SELECT COUNT(*) FROM following_follower WHERE follower_id = $1) AS following_count
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting followers and following count:", error);
    throw new Error("Error getting followers and following count");
  }
};
