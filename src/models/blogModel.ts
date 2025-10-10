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

const baseUrl = process.env.BASE_URL

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
// export const getAllBlogsService = async (): Promise<Blog[]> => {
//   const query = `
//     SELECT * FROM blogs
//   `;

//   try {
//     const result = await pool.query(query);
//     return result.rows;
//   } catch (error) {
//     console.error("Error retrieving blogs:", error);
//     throw new Error("Error retrieving blogs");
//   }
// };
export const getAllBlogsService = async (): Promise<Blog[]> => {

  const query = `
  SELECT 
    b.id,
    b.event_category_id,
    b.blog_name,
    '${baseUrl}/' || b.banner_img_url AS banner_img_url,
    '${baseUrl}/' || b.blog_img_url AS blog_img_url,
    b.blog_video_link,
    b.youtube_link,
    b.facebook_link,
    b.instagram_link,
    b.pinterest_link,
    b.twitter_link,
    b.blog_content,
    b.author_id,
    u.username AS author_name,  -- 👈 fetch author_name from users table
    b.created_at
  FROM blogs b
  LEFT JOIN users u ON b.author_id = u.id
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
export const getBlogCommentsService = async (blogId: string) => {
  // check if blogId is provided
  if (!blogId) {
    return Promise.reject(new Error("Blog ID is required"));
  }

  try {
    const result = await pool.query(
      `SELECT * FROM blog_comments WHERE blog_id = $1`,
      [blogId]
    );
    // get username using user_id
    const userIds = result.rows.map((comment) => comment.user_id);
    const users = await pool.query(
      `SELECT id, username FROM users WHERE id = ANY($1::text[])`,
      [userIds]
    );
    const userMap = new Map(users.rows.map((user) => [user.id, user.username]));

    // map comments to include username
    const commentsWithUsernames = result.rows.map((comment) => ({
      ...comment,
      username: userMap.get(comment.user_id) || "Unknown",
    }));

    // check on every comment and find the reply_to for each and every comment and make a array using it
    // const replyComments = commentsWithUsernames.filter(
    //   (comment) => comment.reply_to
    // );

    // // make an array with child comments
    // const childComments = replyComments.map((comment) => {
    //   const parentComment = commentsWithUsernames.find(
    //     (c) => c.id === comment.reply_to
    //   );
    //   return {
    //     ...comment,
    //     parent_comment_username:
    //       userMap.get(parentComment.user_id) || "Unknown",
    //   };
    // });

    // // map all child comments to their parent comment
    // const commentsWithParents = commentsWithUsernames.map((comment) => {
    //   const child = childComments.find((c) => c.reply_to === comment.id);
    //   return {
    //     ...comment,
    //     child_comments: child ? [child] : [],
    //   };
    // });
    // // check if child comment also have child comment add that as well
    // commentsWithParents.forEach((comment) => {
    //   comment.child_comments.forEach((child: any) => {
    //     const grandChild = childComments.find((c) => c.reply_to === child.id);
    //     if (grandChild) {
    //       child.child_comments = child.child_comments || [];
    //       child.child_comments.push(grandChild);
    //     }
    //   });
    // });

    const rawData = commentsWithUsernames;
    const fullTree = buildCommentTree(rawData, "US00001");
    const limitedTree = limitCommentDepth(fullTree, 2);

    return commentsWithUsernames;
  } catch (error) {
    console.error("Error retrieving blog comments:", error);
    throw new Error("Error retrieving blog comments");
  }
};
type RawComment = {
  id: string;
  reply_to: string;
  blog_id: string;
  user_id: string;
  content: string;
  created_at: string;
  username: string;
};

type Comment = {
  id: string;
  author: string;
  date: string;
  content: string;
  avatarUrl: string;
  isOwner: boolean;
  replies: Comment[];
};

// Format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Step 1: Build full tree from flat array
function buildCommentTree(raw: RawComment[], currentUserId: string): Comment[] {
  const map = new Map<string, Comment>();

  raw.forEach((c) => {
    map.set(c.id, {
      id: c.id,
      author: c.username,
      date: formatDate(c.created_at),
      content: c.content,
      avatarUrl: "/avatar-img/user-preview.png",
      isOwner: c.user_id === currentUserId,
      replies: [],
    });
  });

  const tree: Comment[] = [];
  raw.forEach((c) => {
    if (c.reply_to) {
      const parent = map.get(c.reply_to);
      if (parent) {
        parent.replies.push(map.get(c.id)!);
      }
    } else {
      tree.push(map.get(c.id)!);
    }
  });

  return tree;
}

// Step 2: Limit depth
function limitCommentDepth(
  comments: Comment[],
  maxDepth: number = 2
): Comment[] {
  function process(list: Comment[], depth: number): Comment[] {
    return list.map((comment) => {
      if (depth >= maxDepth) {
        // flatten deeper replies into this level
        return {
          ...comment,
          replies: comment.replies.flatMap((c) => [
            { ...c, replies: [] }, // cut off deeper nesting
            ...process(c.replies, depth), // pull grandchildren up here
          ]),
        };
      }
      return {
        ...comment,
        replies: process(comment.replies, depth + 1),
      };
    });
  }

  return process(comments, 1);
}
