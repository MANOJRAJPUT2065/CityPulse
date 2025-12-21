import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Clock } from 'lucide-react';
import { getTimeAgo, getDomainColor, getStatusColor, getImageUrl } from '../lib/utils';

const PostCard = ({ post, onComment, onBookmark, onDelete, isOwner = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(post?.isBookmarked || false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onBookmark) onBookmark(post._id);
  };

  const getDomainEmoji = (domain) => {
    const emojis = {
      water: '💧',
      garbage: '🗑️',
      road: '🚗',
      street: '💡',
      animals: '🐕',
      recycling: '♻️',
      others: '🔧',
    };
    return emojis[domain] || '📍';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {post?.user?.name ? post.user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {post?.user?.name || 'Anonymous'}
                </p>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post?.status || 'pending')}`}>
                  {post?.status || 'Pending'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 mt-1">
                <Clock size={12} />
                <span>{getTimeAgo(post?.createdAt)}</span>
              </p>
            </div>
          </div>

          {/* Delete Button (if owner) */}
          {isOwner && (
            <button
              onClick={() => onDelete && onDelete(post._id)}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Domain & Location */}
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getDomainColor(post?.domain)}`}>
            <span className="mr-1">{getDomainEmoji(post?.domain)}</span>
            {post?.domain?.charAt(0).toUpperCase() + post?.domain?.slice(1) || 'Other'}
          </span>

          {post?.location && (
            <span className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
              <MapPin size={14} className="mr-1" />
              {post.location}
            </span>
          )}
        </div>

        {/* Post Description */}
        <div>
          <p className={`text-gray-700 dark:text-gray-300 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
            {post?.content}
          </p>
          {post?.content?.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium mt-2"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>

        {/* Image */}
        {post?.image && (
          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={getImageUrl(post.image)}
              alt="Issue"
              className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
        <span>{post?.comments?.length || 0} comments</span>
        <span>{post?.likes || 0} likes</span>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-sm">
          <Heart size={18} className="group-hover:fill-red-500" />
          <span>Like</span>
        </button>

        <button
          onClick={() => setIsCommentOpen(!isCommentOpen)}
          className="flex-1 flex items-center justify-center space-x-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-sm"
        >
          <MessageCircle size={18} />
          <span>Reply</span>
        </button>

        <button
          onClick={handleBookmark}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition text-sm ${
            isBookmarked
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          <span>Save</span>
        </button>

        <button className="flex-1 flex items-center justify-center space-x-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-sm">
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {isCommentOpen && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          {post?.comments && post.comments.length > 0 ? (
            <div className="space-y-3 mb-3">
              {post.comments.slice(0, 3).map((comment) => (
                <div key={comment._id} className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{comment.user?.name}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">No comments yet. Be the first!</p>
          )}

          {/* Comment Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setIsCommentOpen(false)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
