// Create web server

// Import express
const express = require('express');

// Create router object
const router = express.Router();

// Import comment model
const Comment = require('../models/comment');

// Import post model
const Post = require('../models/post');

// Import middlewares
const { isLoggedIn, checkCommentOwnership } = require('../middlewares');

// Comment create route
router.post('/posts/:id/comments', isLoggedIn, async (req, res) => {
  // Find post
  try {
    const foundPost = await Post.findById(req.params.id);

    // Create comment
    const comment = await Comment.create(req.body.comment);

    // Add comment to post
    foundPost.comments.push(comment);

    // Save post
    await foundPost.save();

    // Redirect to show page
    res.redirect(`/posts/${foundPost._id}`);
  } catch (err) {
    console.log(err);
  }
});

// Comment edit route
router.get(
  '/posts/:id/comments/:comment_id/edit',
  checkCommentOwnership,
  async (req, res) => {
    try {
      // Find comment
      const foundComment = await Comment.findById(req.params.comment_id);

      // Render edit page
      res.render('comments/edit', {
        post_id: req.params.id,
        comment: foundComment,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

// Comment update route
router.put(
  '/posts/:id/comments/:comment_id',
  checkCommentOwnership,
  async (req, res) => {
    try {
      // Update comment
      await Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment
      );

      // Redirect to show page
      res.redirect(`/posts/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  }
);

// Comment delete route
router.delete(
  '/posts/:id/comments/:comment_id',
  checkCommentOwnership,
  async (req, res) => {
    try {
      // Delete comment
      await Comment.findByIdAndDelete(req.params.comment_id);

      // Redirect to show page
      res.redirect(`/posts/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  }
);

// Export router
module.exports = router;