// backend/routes/adminRoutes.js
import express from "express";
import Post from "../models/postModel.js";
import auth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import Notification from "../models/Notification.js";

const router = express.Router();

  
// ✅ GET all posts for Admin Dashboard
router.get("/", auth, requireAdmin, async (req, res) => {
  console.log("Inside admin dashboard.....");

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("comments.user", "name email");

    console.log("📦 Posts to be sent:", posts);
    return res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    return res.status(500).json({ message: "Error fetching posts" });
  }
});

// ✅ Export posts as CSV (admin only)
router.get("/export.csv", auth, requireAdmin, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    const header = [
      'createdAt','status','severity','domain','location','content','likes','stars','deadlineAt','assigneeName','assigneeType','userName','userEmail'
    ];

    const escapeCell = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = posts.map(p => [
      p.createdAt?.toISOString() || '',
      p.status || '',
      p.severity || '',
      p.domain || '',
      p.location || '',
      p.content || '',
      p.likes || 0,
      p.stars || 0,
      p.deadlineAt ? new Date(p.deadlineAt).toISOString().slice(0,10) : '',
      p.assignee?.name || '',
      p.assignee?.type || '',
      p.user?.name || '',
      p.user?.email || '',
    ].map(escapeCell).join(','));

    const csv = [header.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="citypulse-posts.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ message: 'Error exporting CSV' });
  }
});

// ✅ Delete a post by ID
router.delete("/:id", auth, requireAdmin, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// ✅ Toggle status (pending <-> complete)
router.patch("/:id/status", auth, requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = post.status === "pending" ? "complete" : "pending";
    await post.save();
    const populated = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");
    // notify post owner
    await Notification.create({
      user: populated.user?._id,
      post: populated._id,
      actor: req.user._id,
      type: 'status',
      message: `Your report status is now ${populated.status}`,
    });
    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Error toggling status" });
  }
});

// ✅ Add star (reward)
router.patch("/:id/star", auth, requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.stars = (post.stars || 0) + 1;
    await post.save();
    const populated = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");
    // notify post owner
    await Notification.create({
      user: populated.user?._id,
      post: populated._id,
      actor: req.user._id,
      type: 'star',
      message: `Your report received a star by admin`,
    });
    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Error adding star" });
  }
});

// ✅ Update assignment/severity/deadline
router.patch("/:id/manage", auth, requireAdmin, async (req, res) => {
  try {
    const { severity, deadlineAt, assignee } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (severity) post.severity = severity;
    if (deadlineAt) post.deadlineAt = new Date(deadlineAt);
    if (assignee) post.assignee = assignee;
    await post.save();

    const populated = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");
    return res.status(200).json(populated);
  } catch (err) {
    return res.status(500).json({ message: "Error updating post management" });
  }
});

// ✅ Add progress update note
router.post("/:id/update", auth, requireAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.updates.push({ text, createdAt: new Date(), user: req.user._id });
    await post.save();
    const populated = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");
    return res.status(201).json(populated);
  } catch (err) {
    return res.status(500).json({ message: "Error adding update" });
  }
});

// ✅ Add comment to post
router.post("/:id/comment", auth, requireAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      text,
      createdAt: new Date(),
      user: req.user._id,
    };

    post.comments.push(newComment);
    await post.save();
    const populated = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");
    await Notification.create({
      user: populated.user?._id,
      post: populated._id,
      actor: req.user._id,
      type: 'comment',
      message: `Admin commented on your report`,
    });
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
});

export default router;
