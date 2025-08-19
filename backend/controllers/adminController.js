import Post from '../models/postModel.js';
import User from '../models/User.js';

// Get all posts for admin dashboard with advanced filtering
export const getAllPostsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Advanced filtering
    const filter = {};
    if (req.query.domain) filter.domain = req.query.domain;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.isUrgent) filter.isUrgent = req.query.isUrgent === 'true';
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    
    // Date range filtering
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) {
        filter.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filter.createdAt.$lte = new Date(req.query.dateTo);
      }
    }

    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { content: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'priority':
          sort = { priority: -1, createdAt: -1 };
          break;
        case 'status':
          sort = { status: 1, createdAt: -1 };
          break;
        case 'likes':
          sort = { likes: -1 };
          break;
        case 'domain':
          sort = { domain: 1, createdAt: -1 };
          break;
        case 'urgent':
          sort = { isUrgent: -1, createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const posts = await Post.find(filter)
      .populate('user', 'name email userType')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email userType')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    // Get quick stats
    const stats = await Post.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          urgentCount: { $sum: { $cond: ['$isUrgent', 1, 0] } },
          pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgressCount: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolvedCount: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          averageLikes: { $avg: '$likes' },
          totalViews: { $sum: '$viewCount' }
        }
      }
    ]);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      quickStats: stats[0] || {
        urgentCount: 0,
        pendingCount: 0,
        inProgressCount: 0,
        resolvedCount: 0,
        averageLikes: 0,
        totalViews: 0
      }
    });
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Update post status with admin privileges
export const updatePostStatus = async (req, res) => {
  try {
    const { status, assignedTo, estimatedResolutionTime, adminNote } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update fields
    if (status) {
      post.status = status;
      
      // Set actual resolution time if marking as resolved
      if (status === 'resolved' && !post.actualResolutionTime) {
        post.actualResolutionTime = new Date();
      }
    }
    
    if (assignedTo) post.assignedTo = assignedTo;
    if (estimatedResolutionTime) post.estimatedResolutionTime = estimatedResolutionTime;

    // Add admin comment if provided
    if (adminNote) {
      const adminComment = {
        text: adminNote,
        user: req.user.id,
        isAdminComment: true,
        createdAt: new Date()
      };
      post.comments.push(adminComment);
    }

    await post.save();
    await post.populate(['user', 'assignedTo', 'comments.user']);

    console.log(`✅ Post ${post._id} status updated to ${status} by admin ${req.user.id}`);
    
    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Error updating post status:', error);
    res.status(500).json({ message: 'Error updating post status', error: error.message });
  }
};

// Delete post (admin only)
export const deletePostAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete associated media file if exists
    if (post.media && post.media.path) {
      try {
        fs.unlinkSync(post.media.path);
        console.log(`🗑️ Deleted media file: ${post.media.path}`);
      } catch (err) {
        console.log('Error deleting media file:', err.message);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    
    console.log(`🗑️ Post ${req.params.id} deleted by admin ${req.user.id}`);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Add/Remove stars (reward system)
export const toggleStar = async (req, res) => {
  try {
    const { action = 'add' } = req.body; // 'add' or 'remove'
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (action === 'add') {
      post.stars = (post.stars || 0) + 1;
    } else if (action === 'remove' && post.stars > 0) {
      post.stars -= 1;
    }

    await post.save();
    
    res.json({
      message: `Star ${action}ed successfully`,
      stars: post.stars
    });
  } catch (error) {
    console.error('Error toggling star:', error);
    res.status(500).json({ message: 'Error toggling star', error: error.message });
  }
};

// Add admin comment
export const addAdminComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const adminComment = {
      text: text.trim(),
      user: req.user.id,
      isAdminComment: true,
      createdAt: new Date()
    };

    post.comments.push(adminComment);
    await post.save();

    await post.populate('comments.user', 'name email userType');

    res.status(201).json({
      message: 'Admin comment added successfully',
      comment: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    console.error('Error adding admin comment:', error);
    res.status(500).json({ message: 'Error adding admin comment', error: error.message });
  }
};

// Get comprehensive dashboard analytics
export const getAdminAnalytics = async (req, res) => {
  try {
    // Overall statistics
    const totalPosts = await Post.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Status breakdown
    const statusStats = await Post.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Domain breakdown
    const domainStats = await Post.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          avgLikes: { $avg: '$likes' },
          totalViews: { $sum: '$viewCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Priority breakdown
    const priorityStats = await Post.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          avgResolutionTime: { $avg: { $subtract: ['$actualResolutionTime', '$createdAt'] } }
        }
      }
    ]);

    // Monthly trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

    const monthlyTrends = await Post.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          posts: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          urgent: { $sum: { $cond: ['$isUrgent', 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top performing users (by posts and likes)
    const topUsers = await Post.aggregate([
      {
        $group: {
          _id: '$user',
          postCount: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalStars: { $sum: '$stars' }
        }
      },
      { $sort: { totalLikes: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          postCount: 1,
          totalLikes: 1,
          totalStars: 1,
          userName: { $arrayElemAt: ['$userInfo.name', 0] },
          userEmail: { $arrayElemAt: ['$userInfo.email', 0] }
        }
      }
    ]);

    // Response time analytics
    const responseTimeStats = await Post.aggregate([
      {
        $match: {
          actualResolutionTime: { $exists: true },
          createdAt: { $exists: true }
        }
      },
      {
        $project: {
          resolutionTimeHours: {
            $divide: [
              { $subtract: ['$actualResolutionTime', '$createdAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          },
          domain: 1,
          priority: 1
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: '$resolutionTimeHours' },
          minResolutionTime: { $min: '$resolutionTimeHours' },
          maxResolutionTime: { $max: '$resolutionTimeHours' }
        }
      }
    ]);

    // Recent urgent posts
    const urgentPosts = await Post.find({
      isUrgent: true,
      status: { $in: ['pending', 'in_progress'] }
    })
    .populate('user', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      overview: {
        totalPosts,
        totalUsers,
        urgentPosts: await Post.countDocuments({ isUrgent: true, status: { $ne: 'resolved' } })
      },
      statusBreakdown: statusStats,
      domainBreakdown: domainStats,
      priorityBreakdown: priorityStats,
      monthlyTrends,
      topUsers,
      responseTimeStats: responseTimeStats[0] || {
        avgResolutionTime: 0,
        minResolutionTime: 0,
        maxResolutionTime: 0
      },
      urgentPostsList: urgentPosts
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Bulk operations
export const bulkUpdatePosts = async (req, res) => {
  try {
    const { postIds, updates } = req.body;
    
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({ message: 'Post IDs array is required' });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Updates object is required' });
    }

    // Validate updates
    const allowedUpdates = ['status', 'priority', 'assignedTo', 'isUrgent'];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every(key => allowedUpdates.includes(key));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid update fields' });
    }

    const result = await Post.updateMany(
      { _id: { $in: postIds } },
      { $set: updates }
    );

    res.json({
      message: 'Bulk update completed',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({ message: 'Error in bulk update', error: error.message });
  }
};

// Assign posts to admin users
export const assignPost = async (req, res) => {
  try {
    const { adminId } = req.body;
    
    // Verify that the admin user exists
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.userType !== 'admin') {
      return res.status(400).json({ message: 'Invalid admin user' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.assignedTo = adminId;
    if (post.status === 'pending') {
      post.status = 'in_progress';
    }

    await post.save();
    await post.populate(['user', 'assignedTo']);

    res.json({
      message: 'Post assigned successfully',
      post
    });
  } catch (error) {
    console.error('Error assigning post:', error);
    res.status(500).json({ message: 'Error assigning post', error: error.message });
  }
};

// Get all admin users for assignment
export const getAdminUsers = async (req, res) => {
  try {
    const admins = await User.find({ userType: 'admin' })
      .select('name email')
      .sort({ name: 1 });

    res.json({ admins });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ message: 'Error fetching admin users', error: error.message });
  }
};