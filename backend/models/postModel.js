// models/postModel.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const postSchema = new mongoose.Schema({
  content: String,
  location: String,
  domain: String,
  media: {
    type: String,
    default: "",
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  deadlineAt: { type: Date },
  assignee: {
    name: { type: String, default: "" },
    type: { type: String, default: "" }, // e.g., Department/NGO
  },
  status: {
    type: String,
    enum: ["pending", "complete"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  stars: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  updates: [
    new mongoose.Schema({
      text: String,
      createdAt: Date,
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    }, { _id: false })
  ],
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
