import express from "express";
import upload from "../middleware/upload.js"; // Make sure this exists
import Post from "../models/postModel.js";

const router = express.Router();

// ✅ Submit a new post
router.post("/post", upload.single("media"), async (req, res) => {
  console.log("Inside post Route .....");
  try {
    const { content, domain, location } = req.body;
    const mediaFile = req.file;

    console.log("📝 New Issue:", { content, domain, location });
    console.log("📁 File uploaded:", mediaFile?.originalname);

    const dummyUserId = "687014cb06d969e3c50e7680"; // Replace with actual user if using auth

    const newPost = new Post({
      content,
      domain,
      location,
      media: mediaFile?.filename || "", // assuming you added 'media' field in postModel
      user: dummyUserId,
    });

    await newPost.save();

    res.status(200).json({ message: "Post submitted!" });
  } catch (err) {
    console.error("Post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
