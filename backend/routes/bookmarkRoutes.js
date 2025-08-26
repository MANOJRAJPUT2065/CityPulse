import express from 'express';
import auth from '../middleware/auth.js';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const list = await Bookmark.find({ user: req.user._id }).populate({ path: 'post', populate: [{ path: 'user', select: 'name email' }, { path: 'comments.user', select: 'name email' }] });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
});

router.post('/:postId', auth, async (req, res) => {
  try {
    await Bookmark.updateOne({ user: req.user._id, post: req.params.postId }, { $setOnInsert: { user: req.user._id, post: req.params.postId } }, { upsert: true });
    res.status(200).json({ message: 'Bookmarked' });
  } catch (err) {
    res.status(500).json({ message: 'Error bookmarking' });
  }
});

router.delete('/:postId', auth, async (req, res) => {
  try {
    await Bookmark.deleteOne({ user: req.user._id, post: req.params.postId });
    res.status(200).json({ message: 'Removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing bookmark' });
  }
});

export default router;


