const express = require('express');
const router = express.Router();
const post = require('../models/Post');
const { authenticateToken } = require('./auth')
//get all posts
router.get('/',  authenticateToken, async (req, res) => {
    try {
        const posts = await post.find();
        res.json(posts);
    } catch (err) {
        res.json({
            message: err
        });
    }
}); // '/' cuz in app.js we specify that it's for /posts

//sumbit a post
router.post('/', authenticateToken, async (req, res) => {
    const newPost = new post({
        title: req.body.title,
        description: req.body.description,
    });

    try {
        const savedPost = await newPost.save();
        res.json(savedPost);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//get specific post
router.get('/:postId', authenticateToken, async (req, res) => {
    try {
        const specificPost = await post.findById(req.params.postId);
        res.json(specificPost);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//delete post
router.delete('/:postId', authenticateToken, async (req, res) => {
    try {
        const removedPost = await post.deleteOne({
            _id: req.params.postId
        });
        res.json(removedPost)
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//update
router.patch('/:postId', authenticateToken, async (req, res) => {
    try {
        const updatedPost = await post.updateOne(
            {_id: req.params.postId},
            {
                $set:
                    {
                        title: req.body.title,
                        description: req.body.description,
                    }
            }
        );
        res.json(updatedPost);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

module.exports = router;
