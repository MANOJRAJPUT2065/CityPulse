import express from "express";
import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getPostsByDomain,
  getUserPosts,
  getDashboardStats
} from "../controllers/postController.js";
import {
  validateCreatePost,
  validateUpdatePost,
  validateAddComment,
  validateObjectId,
  validateDomain,
  validateQuery
} from "../middleware/validation.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/", validateQuery, getAllPosts);
router.get("/domain/:domain", validateDomain, validateQuery, getPostsByDomain);
router.get("/:id", validateObjectId, getPostById);

// Protected routes (auth required)
router.use(auth); // All routes below require authentication

// Post management
router.post("/", upload.single("media"), validateCreatePost, createPost);
router.put("/:id", validateObjectId, validateUpdatePost, updatePost);
router.delete("/:id", validateObjectId, deletePost);

// Post interactions
router.post("/:id/like", validateObjectId, toggleLike);
router.post("/:id/comment", validateObjectId, validateAddComment, addComment);

// User-specific routes
router.get("/user/:userId", validateQuery, getUserPosts);
router.get("/user/me/posts", validateQuery, getUserPosts);

// Dashboard and statistics
router.get("/stats/dashboard", getDashboardStats);

// Legacy route for backward compatibility
router.post("/post", upload.single("media"), validateCreatePost, createPost);

export default router;
