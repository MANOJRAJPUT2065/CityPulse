// backend/routes/adminRoutes.js
import express from "express";
import Post from "../models/postModel.js";

const router = express.Router();

// ✅ Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// ✅ Delete a post by ID
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// ✅ Toggle status (pending <-> complete)
router.patch("/:id/status", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = post.status === "pending" ? "complete" : "pending";
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error toggling status" });
  }
});

// ✅ Add star (reward)
router.patch("/:id/star", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.stars = (post.stars || 0) + 1;
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error adding star" });
  }
});

// ✅ Add comment to post
router.post("/:id/comment", async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
});

export default router;
