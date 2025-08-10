import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import {
  blogCommentSchema,
  blogCreateSchema,
  updateBlogSchema,
} from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { Blog, BlogComment } from "../types/types";

export const createBlogService = async (blogData: Blog): Promise<void> => {
  // Validate the blog data
  // check all input data with schema validation in Joi
  let checkData = validation(blogCreateSchema, blogData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  try {
    // Create a unique ID for the blog
    const blogId = await createId(id_codes.idCode.blog);
    blogData.id = blogId;

    // Insert the blog into the database
    const result = await pool.query(
      `
    INSERT INTO blogs (id, event_category_id, blog_name, banner_img_url, blog_img_url, blog_video_link, youtube_link, facebook_link, instagram_link, pinterest_link, twitter_link, blog_content, author_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  `,
      [
        blogData.id,
        blogData.event_category_id,
        blogData.blog_name,
        blogData.banner_img_url,
        blogData.blog_img_url,
        blogData.blog_video_link,
        blogData.youtube_link,
        blogData.facebook_link,
        blogData.instagram_link,
        blogData.pinterest_link,
        blogData.twitter_link,
        blogData.blog_content,
        blogData.author_id,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating blog:", error);
    throw new Error("Error creating blog");
  }
};

// this function retrieves all blog posts
export const getAllBlogsService = async (): Promise<Blog[]> => {
  const query = `
    SELECT * FROM blogs
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    throw new Error("Error retrieving blogs");
  }
};

// This function retrieves blogs by user ID
export const getBlogsByUserIdService = async (
  userId: string
): Promise<Blog[]> => {
  // check if userId is provided
  if (!userId) {
    return Promise.reject(new Error("User ID is required"));
  }

  // check if the user is in user table
  const userCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  if (userCheck.rows.length === 0) {
    return Promise.reject(new Error("User not found"));
  }
  const query = `
    SELECT * FROM blogs WHERE author_id = $1
  `;
  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving blogs by user ID:", error);
    throw new Error("Error retrieving blogs by user ID");
  }
};

// This function retrieves blogs by category ID
export const getBlogsByCategoryIdService = async (
  categoryId: string
): Promise<Blog[]> => {
  // check if categoryId is provided
  if (!categoryId) {
    return Promise.reject(new Error("Category ID is required"));
  }
  // check if the category is in categories table
  const categoryCheck = await pool.query(
    `SELECT * FROM event_categories WHERE id = $1`,
    [categoryId]
  );
  if (categoryCheck.rows.length === 0) {
    return Promise.reject(new Error("Category not found"));
  }

  const query = `
    SELECT * FROM blogs WHERE event_category_id = $1
  `;
  try {
    const result = await pool.query(query, [categoryId]);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving blogs by category ID:", error);
    throw new Error("Error retrieving blogs by category ID");
  }
};

// This function retrieves a blog by its ID
export const getBlogByIdService = async (
  blogId: string
): Promise<Blog | null> => {
  // check if blogId is provided
  if (!blogId) {
    return Promise.reject(new Error("Blog ID is required"));
  }
  const query = `
    SELECT * FROM blogs WHERE id = $1
  `;
  try {
    const result = await pool.query(query, [blogId]);
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Blog not found"));
    }
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error retrieving blog by ID:", error);
    throw new Error("Error retrieving blog by ID");
  }
};
// This function updates a blog by its ID
export const updateBlogByIdService = async (
  blogId: string,
  blogData: Partial<Blog>
): Promise<Blog | null> => {
  // check if blogId is provided
  if (!blogId) {
    return Promise.reject(new Error("Blog ID is required"));
  }
  // check all input data with schema validation in Joi
  let checkData = validation(updateBlogSchema, blogData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  // check if blog exists
  const blog = await getBlogByIdService(blogId);
  if (!blog) {
    return Promise.reject(new Error("Blog not found"));
  }

  try {
    const fields = Object.keys(blogData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = [blogId, ...Object.values(blogData)];

    const result = await pool.query(
      `UPDATE blogs SET ${fields} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating blog by ID:", error);
    throw new Error("Error updating blog by ID");
  }
};

// This function create a like for blog
export const createBlogLikeService = async (
  blogId: string,
  userId: string
): Promise<void> => {
  // check if blogId and userId are provided
  if (!blogId || !userId) {
    return Promise.reject(new Error("Blog ID and User ID are required"));
  }

  // check if the blog exists
  const blogCheck = await getBlogByIdService(blogId);
  if (!blogCheck) {
    return Promise.reject(new Error("Blog not found"));
  }

  // check if the user exists
  const userCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  if (userCheck.rows.length === 0) {
    return Promise.reject(new Error("User not found"));
  }

  // check if the user id and blog id record already exists
  const likeCheck = await pool.query(
    `SELECT * FROM blog_likes WHERE blog_id = $1 AND user_id = $2`,
    [blogId, userId]
  );
  if (likeCheck.rows.length > 0) {
    return Promise.reject(new Error("Blog already liked by user"));
  }

  try {
    await pool.query(
      `INSERT INTO blog_likes (blog_id, user_id) VALUES ($1, $2)`,
      [blogId, userId]
    );
  } catch (error) {
    console.error("Error creating blog like:", error);
    throw new Error("Error creating blog like");
  }
};
// This function removes a like for a blog
export const removeBlogLikeService = async (
  blogId: string,
  userId: string
): Promise<void> => {
  // check if blogId and userId are provided
  if (!blogId || !userId) {
    return Promise.reject(new Error("Blog ID and User ID are required"));
  }

  // check if the blog exists
  const blogCheck = await getBlogByIdService(blogId);
  if (!blogCheck) {
    return Promise.reject(new Error("Blog not found"));
  }

  // check if the user exists
  const userCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  if (userCheck.rows.length === 0) {
    return Promise.reject(new Error("User not found"));
  }

  try {
    await pool.query(
      `DELETE FROM blog_likes WHERE blog_id = $1 AND user_id = $2`,
      [blogId, userId]
    );
  } catch (error) {
    console.error("Error removing blog like:", error);
    throw new Error("Error removing blog like");
  }
};

// get like count by blog id
export const getBlogLikeCountService = async (
  blogId: string
): Promise<number> => {
  // check if blogId is provided
  if (!blogId) {
    return Promise.reject(new Error("Blog ID is required"));
  }

  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM blog_likes WHERE blog_id = $1`,
      [blogId]
    );
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error("Error retrieving blog like count:", error);
    throw new Error("Error retrieving blog like count");
  }
};

// blog comment
export const createBlogCommentService = async (
  blogCommentData: BlogComment
): Promise<void> => {
  // check all input data with schema validation in Joi
  let checkData = validation(blogCommentSchema, blogCommentData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  const { blog_id, user_id, content, reply_to } = blogCommentData;

  // check if the blog exists
  const blogCheck = await getBlogByIdService(blog_id);
  if (!blogCheck) {
    return Promise.reject(new Error("Blog not found"));
  }

  // check if the user exists
  const userCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    user_id,
  ]);
  if (userCheck.rows.length === 0) {
    return Promise.reject(new Error("User not found"));
  }

  try {
    // generate the id for the blog comment
    const commentId = await createId(id_codes.idCode.blogComment);
    await pool.query(
      `INSERT INTO blog_comments (id, blog_id, user_id, content, reply_to) VALUES ($1, $2, $3, $4, $5)`,
      [commentId, blog_id, user_id, content, reply_to]
    );
  } catch (error) {
    console.error("Error creating blog comment:", error);
    throw new Error("Error creating blog comment");
  }
};

// get blog comments
export const getBlogCommentsService = async (
  blogId: string
): Promise<BlogComment[]> => {
  // check if blogId is provided
  if (!blogId) {
    return Promise.reject(new Error("Blog ID is required"));
  }

  try {
    const result = await pool.query(
      `SELECT * FROM blog_comments WHERE blog_id = $1`,
      [blogId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error retrieving blog comments:", error);
    throw new Error("Error retrieving blog comments");
  }
};
