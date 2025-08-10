import { Request, Response, NextFunction } from "express";
import {
  createBlogCommentService,
  createBlogLikeService,
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  getBlogCommentsService,
  getBlogLikeCountService,
  getBlogsByCategoryIdService,
  getBlogsByUserIdService,
  removeBlogLikeService,
  updateBlogByIdService,
} from "../models/blogModel";
import fs from "fs";

// this function is for create the banner image and return its path
export const createBannerImg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }
    const normalizedPath = req.file.path.replace(/\\/g, "/");

    res.status(201).json({
      message: "Banner image created successfully.",
      banner_img_url: normalizedPath,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function is for update the banner image and return its path
export const updateBannerImg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.blogId;
    // 1. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }
    const normalizedPath = req.file.path.replace(/\\/g, "/");

    // 3. (Optional but Recommended) Delete the old image path
    const oldBlog = await getBlogByIdService(blogId);
    if (oldBlog && oldBlog.banner_img_url) {
      // Delete the old image file from the server
      fs.unlink(oldBlog.banner_img_url, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        }
      });
    }
    res.status(200).json({
      message: "Banner image updated successfully.",
      banner_img_url: normalizedPath,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    // remove destination and blog_img_url from req.body
    delete req.body.destination;
    delete req.body.blog_img_url;
    const normalizedPath = req.file.path.replace(/\\/g, "/");

    req.body.blog_img_url = normalizedPath;
    const blogData = req.body;
    const newBlog = await createBlogService(blogData);

    res
      .status(201)
      .json({ message: "Blog created successfully.", blog: newBlog });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await getAllBlogsService();

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function retrieves blogs by user ID
export const getBlogsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const blogs = await getBlogsByUserIdService(userId);
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function retrieves blogs by category ID
export const getBlogsByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.categoryId;
    const blogs = await getBlogsByCategoryIdService(categoryId);
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function retrieves a blog by its ID
export const getBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.blogId;
    const blog = await getBlogByIdService(blogId);
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function updates a blog by its ID
export const updateBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.blogId;
    const blogData = req.body;

    // check if the blogId is provided
    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    // remove destination and blog_img_url from req.body
    delete blogData.destination;
    delete blogData.blog_img_url;

    // 2. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }
    const normalizedPath = req.file.path.replace(/\\/g, "/");
    req.body.blog_img_url = normalizedPath;

    // 3. (Optional but Recommended) Delete the old image path
    const oldBlog = await getBlogByIdService(blogId);
    if (oldBlog && oldBlog.blog_img_url) {
      // Delete the old image file from the server
      fs.unlink(oldBlog.blog_img_url, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        }
      });
    }
    // 4. Update the blog
    const updatedBlog = await updateBlogByIdService(blogId, blogData);
    res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function retrieves the like count for a blog
export const getBlogLikeCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.blogId;
    const likeCount = await getBlogLikeCountService(blogId);
    res.status(200).json({
      success: true,
      data: likeCount,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function is for like the blog
export const likeBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.UserID;

    await createBlogLikeService(blogId, userId);
    res.status(200).json({
      success: true,
      message: "Blog liked successfully",
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function is for removing a like from a blog
export const unlikeBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.UserID;

    await removeBlogLikeService(blogId, userId);
    res.status(200).json({
      success: true,
      message: "Blog unliked successfully",
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function retrieves comments for a blog post
export const getBlogComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.blogId;
    const comments = await getBlogCommentsService(blogId);
    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// this function is for comment the blog
export const commentOnBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog_id = req.params.blogId;
    const user_id = req.UserID;
    const content = req.body.comment;
    const reply_to = req.body.reply_to;

    await createBlogCommentService({ blog_id, user_id, content, reply_to });
    res.status(201).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};
