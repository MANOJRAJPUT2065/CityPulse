import express from "express";
import auth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  getAllPostsAdmin,
  updatePostStatus,
  deletePostAdmin,
  toggleStar,
  addAdminComment,
  getAdminAnalytics,
  bulkUpdatePosts,
  assignPost,
  getAdminUsers
} from "../controllers/adminController.js";
import {
  validateObjectId,
  validateAdminAction,
  validateAddComment,
  validateQuery
} from "../middleware/validation.js";

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(auth);
router.use(requireAdmin);

// Main admin dashboard routes
router.get("/", validateQuery, getAllPostsAdmin);
router.get("/analytics", getAdminAnalytics);
router.get("/users", getAdminUsers);

// Post management routes
router.patch("/:id/status", validateObjectId, validateAdminAction, updatePostStatus);
router.delete("/:id", validateObjectId, deletePostAdmin);
router.patch("/:id/star", validateObjectId, toggleStar);
router.post("/:id/comment", validateObjectId, validateAddComment, addAdminComment);
router.patch("/:id/assign", validateObjectId, assignPost);

// Bulk operations
router.patch("/bulk/update", bulkUpdatePosts);

// Legacy routes for backward compatibility
router.patch("/:id", validateObjectId, validateAdminAction, updatePostStatus);

export default router;
