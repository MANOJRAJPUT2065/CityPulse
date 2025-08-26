import express from "express";
import upload from "../middleware/upload.js"; // Make sure this exists
import auth from "../middleware/auth.js";
import Post from "../models/postModel.js";
import Bookmark from "../models/Bookmark.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// ✅ Public: Get posts (optionally filter by domain)
router.get("/", async (req, res) => {
  try {
    const { domain, status, q, sort } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50);
    const skip = (page - 1) * limit;
    const query = {};
    if (domain && domain !== "all") {
      query.domain = domain;
    }
    if (status && ["pending", "complete"].includes(status)) {
      query.status = status;
    }
    if (q) {
      query.$or = [
        { content: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
      ];
    }

    const sortBy = sort === 'stars' ? { stars: -1 } : sort === 'likes' ? { likes: -1 } : { createdAt: -1 };

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate("user", "name email userType")
        .populate("comments.user", "name email"),
      Post.countDocuments(query),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);
    return res.status(200).json({ posts, total, page, totalPages });
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    return res.status(500).json({ message: "Error fetching posts" });
  }
});

// ✅ Submit a new post
router.post("/post", auth, upload.single("media"), async (req, res) => {
  console.log("Inside post Route .....");
  try {
    const { content, domain, location } = req.body;
    const allowedDomains = ["water", "garbage", "road", "street", "animals", "recycling", "others"]; 
    if (!content || !domain || !location) {
      return res.status(400).json({ message: "content, domain and location are required" });
    }
    if (!allowedDomains.includes(String(domain).toLowerCase())) {
      return res.status(400).json({ message: "Invalid domain" });
    }
    const mediaFile = req.file;

    console.log("📝 New Issue:", { content, domain, location });
    console.log("📁 File uploaded:", mediaFile?.originalname);

    const userId = req.user?._id;

    const newPost = new Post({
      content,
      domain,
      location,
      media: mediaFile?.filename || "",
      user: userId,
    });

    await newPost.save();

    const populated = await Post.findById(newPost._id)
      .populate("user", "name email userType")
      .populate("comments.user", "name email");

    res.status(200).json({ message: "Post submitted!", post: populated });
  } catch (err) {
    console.error("Post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Like a post (increment likes)
router.patch("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // prevent duplicate like per user
    const userId = req.user._id.toString();
    const already = (post.likedBy || []).some((id) => id.toString() === userId);
    if (!already) {
      post.likes = (post.likes || 0) + 1;
      post.likedBy = [...(post.likedBy || []), req.user._id];
      await post.save();
    }

    const populated = await Post.findById(req.params.id)
      .populate("user", "name email userType")
      .populate("comments.user", "name email");
    await Notification.create({
      user: populated.user?._id,
      post: populated._id,
      actor: req.user._id,
      type: 'like',
      message: `Someone liked your report`,
    });
    return res.status(200).json(populated);
  } catch (err) {
    console.error("❌ Error liking post:", err);
    return res.status(500).json({ message: "Error liking post" });
  }
});

// ✅ Add comment to a post (authenticated user)
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ text, createdAt: new Date(), user: req.user._id });
    await post.save();

    const populated = await Post.findById(req.params.id)
      .populate("user", "name email userType")
      .populate("comments.user", "name email");
    await Notification.create({
      user: populated.user?._id,
      post: populated._id,
      actor: req.user._id,
      type: 'comment',
      message: `Someone commented on your report`,
    });

    res.status(201).json(populated);
  } catch (err) {
    console.error("❌ Error adding comment:", err);
    res.status(500).json({ message: "Error adding comment" });
  }
});

export default router;
