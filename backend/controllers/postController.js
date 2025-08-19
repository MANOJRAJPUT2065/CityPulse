import Post from '../models/postModel.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

// Get all posts with filtering, sorting and pagination
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = {};
    if (req.query.domain) filter.domain = req.query.domain;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.isUrgent) filter.isUrgent = req.query.isUrgent === 'true';
    if (req.query.user) filter.user = req.query.user;
    
    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { content: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Sorting
    let sort = { createdAt: -1 }; // Default: newest first
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'likes':
          sort = { likes: -1 };
          break;
        case 'stars':
          sort = { stars: -1 };
          break;
        case 'priority':
          sort = { priority: 1, createdAt: -1 };
          break;
        case 'status':
          sort = { status: 1, createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const posts = await Post.find(filter)
      .populate('user', 'name email userType')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name email userType')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

// Create new post
export const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, location, domain, priority, tags, coordinates, isUrgent } = req.body;
    
    // Parse coordinates if provided as string
    let parsedCoordinates = null;
    if (coordinates) {
      try {
        parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
      } catch (err) {
        console.log('Invalid coordinates format');
      }
    }

    // Parse tags if provided as string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (err) {
        parsedTags = typeof tags === 'string' ? [tags] : tags;
      }
    }

    // Handle media file
    let mediaData = null;
    if (req.file) {
      mediaData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      };
    }

    const newPost = new Post({
      content,
      location,
      domain,
      priority: priority || 'medium',
      coordinates: parsedCoordinates,
      tags: parsedTags,
      media: mediaData,
      user: req.user.id,
      isUrgent: isUrgent === 'true' || isUrgent === true
    });

    await newPost.save();
    
    // Populate user data before sending response
    await newPost.populate('user', 'name email userType');

    console.log('✅ New post created:', newPost._id);
    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    console.error('❌ Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post or is admin
    if (post.user.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        post[key] = updates[key];
      }
    });

    await post.save();
    await post.populate('user', 'name email userType');

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post or is admin
    if (post.user.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete associated media file if exists
    if (post.media && post.media.path) {
      try {
        fs.unlinkSync(post.media.path);
      } catch (err) {
        console.log('Error deleting media file:', err.message);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Like/Unlike post
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userLikedIndex = post.likedBy.indexOf(req.user.id);
    
    if (userLikedIndex === -1) {
      // User hasn't liked the post, so like it
      post.likedBy.push(req.user.id);
      post.likes += 1;
    } else {
      // User has already liked the post, so unlike it
      post.likedBy.splice(userLikedIndex, 1);
      post.likes -= 1;
    }

    await post.save();
    
    res.json({
      message: userLikedIndex === -1 ? 'Post liked' : 'Post unliked',
      likes: post.likes,
      userLiked: userLikedIndex === -1
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// Add comment to post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      text: text.trim(),
      user: req.user.id,
      isAdminComment: req.user.userType === 'admin',
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the new comment's user data
    await post.populate('comments.user', 'name email');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Get posts by domain
export const getPostsByDomain = async (req, res) => {
  try {
    const { domain } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const validDomains = ["water", "garbage", "road", "street", "animals", "recycling", "others"];
    
    if (!validDomains.includes(domain)) {
      return res.status(400).json({ message: 'Invalid domain' });
    }

    const filter = { domain };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const posts = await Post.find(filter)
      .populate('user', 'name email userType')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      domain,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts by domain:', error);
    res.status(500).json({ message: 'Error fetching posts by domain', error: error.message });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: userId })
      .populate('user', 'name email userType')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ user: userId });

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Error fetching user posts', error: error.message });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userType === 'admin' ? null : req.user.id;
    
    const matchStage = userId ? { user: userId } : {};
    
    const stats = await Post.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          pendingPosts: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgressPosts: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          resolvedPosts: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          urgentPosts: {
            $sum: { $cond: ['$isUrgent', 1, 0] }
          },
          totalLikes: { $sum: '$likes' },
          totalStars: { $sum: '$stars' },
          totalViews: { $sum: '$viewCount' }
        }
      }
    ]);

    // Get posts by domain
    const domainStats = await Post.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentActivity = await Post.countDocuments({
      ...matchStage,
      createdAt: { $gte: weekAgo }
    });

    res.json({
      overview: stats[0] || {
        totalPosts: 0,
        pendingPosts: 0,
        inProgressPosts: 0,
        resolvedPosts: 0,
        urgentPosts: 0,
        totalLikes: 0,
        totalStars: 0,
        totalViews: 0
      },
      domainBreakdown: domainStats,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};