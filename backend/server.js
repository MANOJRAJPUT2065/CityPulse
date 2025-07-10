  // import express from 'express';
  // import mongoose from 'mongoose';
  // import cors from 'cors';
  // import dotenv from 'dotenv';
  // import path from 'path';
  // import postRoutes from './routes/postRoutes.js';
  // import authRoutes from './routes/authRoutes.js';
  // import adminRoutes from './routes/adminRoutes.js';

  // dotenv.config();

  // const app = express();

  // // Middleware
  // app.use(cors());
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true })); // for form-data uploads

  // // Static folder for uploaded files
  // import { fileURLToPath } from 'url';
  // import { dirname } from 'path';
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = dirname(__filename);

  // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // // Routes
  // app.use('/api/auth', authRoutes);
  // app.use('/api/post', postRoutes);
  // app.use('/api/admin', adminRoutes);

  // // Port and MongoDB connection
  // const PORT = process.env.PORT || 5000;

  // mongoose
  //   .connect(process.env.MONGO_URI)
  //   .then(() => {
  //     console.log('✅ MongoDB connected');
  //     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  //   })
  //   .catch((err) => {
  //     console.error('❌ MongoDB connection error:', err);
  //   });


  import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/admin", adminRoutes); // ✅ Make sure this is correct

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
