import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

// Import the new dynamic uploader
import { dynamicUpload } from "../config/multer.config";
import {
  createBlog,
  createBannerImg,
  getAllBlogs,
  getBlogById,
  getBlogsByCategoryId,
  getBlogsByUserId,
  updateBannerImg,
  updateBlogById,
  likeBlog,
  unlikeBlog,
  getBlogLikeCount,
  getBlogComments,
  commentOnBlog,
} from "../controllers/blogController";

const blogRoute = Router();

blogRoute.post(
  "/create-blog",
  tokenAuthHandler,
  dynamicUpload.single("blog_img_url"),
  createBlog
);

blogRoute.get("/get-all-blogs", getAllBlogs);

blogRoute.get(
  "/get-blog-by-user-id/:userId",
  getBlogsByUserId
);

blogRoute.get(
  "/get-blog-by-category-id/:categoryId",
  getBlogsByCategoryId
);

blogRoute.get("/get-blog-by-id/:blogId", getBlogById);

blogRoute.put(
  "/update-blog-by-id/:blogId",
  tokenAuthHandler,
  dynamicUpload.single("blog_img_url"),
  updateBlogById
);

blogRoute.post(
  "/create-banner",
  tokenAuthHandler,
  dynamicUpload.single("banner_img_url"),
  createBannerImg
);

blogRoute.put(
  "/update-banner/:blogId",
  tokenAuthHandler,
  dynamicUpload.single("banner_img_url"),
  updateBannerImg
);

// route for liking a blog
blogRoute.post("/like-blog/:blogId", tokenAuthHandler, likeBlog);

// route for unliking a blog
blogRoute.post("/unlike-blog/:blogId", tokenAuthHandler, unlikeBlog);

// route for get like count
blogRoute.get(
  "/get-blog-like-count/:blogId",
  getBlogLikeCount
);
//get blog comments
blogRoute.get("/get-blog-comments/:blogId", getBlogComments);
// comment to blog
blogRoute.post("/comment-blog/:blogId", tokenAuthHandler, commentOnBlog);

export default blogRoute;
