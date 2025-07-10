// routes/postRoutes.js
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // or use storage config

router.post("/post", upload.single("media"), async (req, res) => {
    console.log("Inside post Route .....");
  try {
    const { content, domain, location } = req.body;
    const mediaFile = req.file;

    console.log("📝 New Issue:", { content, domain, location });
    console.log("📁 File uploaded:", mediaFile?.originalname);

    // Save to DB if needed
    res.status(200).json({ message: "Post submitted!" });
  } catch (err) {
    console.error("Post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
