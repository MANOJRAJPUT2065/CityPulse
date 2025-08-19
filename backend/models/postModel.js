// models/postModel.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 500
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isAdminComment: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  domain: {
    type: String,
    enum: ["water", "garbage", "road", "street", "animals", "recycling", "others"],
    required: true
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "resolved", "rejected"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  stars: {
    type: Number,
    default: 0,
  },
  media: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  },
  tags: [String],
  estimatedResolutionTime: String,
  actualResolutionTime: Date,
  comments: [commentSchema],
  viewCount: {
    type: Number,
    default: 0
  },
  isUrgent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
