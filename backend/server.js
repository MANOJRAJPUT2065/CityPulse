import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/admin", adminRoutes); // ✅ Make sure this is correct
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

// Static uploads serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import authRoutes from './routes/authRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';

// dotenv.config();

// const app = express();

// // ✅ Explicit CORS configuration
// const allowedOrigins = [
//   "http://localhost:5173", // local dev
//   "https://zippy-sorbet-1bd65e.netlify.app", // deployed frontend
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true, // if you're using cookies or authorization headers
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Optional: serve static files from /uploads
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/post", postRoutes);
// app.use("/api/admin", adminRoutes);

// // Start Server
// const PORT = process.env.PORT || 5000;
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error("❌ MongoDB connection error:", err));
