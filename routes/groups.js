const express = require('express');
const router = express.Router();
const group = require('../models/Group');
const Search = require('../models/Search');
const User = require('../models/User');
const {authenticateToken} = require('./auth');

router.get('/', authenticateToken, async (req, res) => {
    try {

        const groups = await group.find().populate('users search');

        res.json(groups);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const userIds = req.body.users;
    const searchId = req.body.search;

    try {
        const users = await User.find({_id: {$in: userIds}});
        const search = await Search.findById(searchId);
        if (!users || !search) {
            return res.status(400).json({message: 'related objects not found'});
        }

        const newGroup = new group({
            name: req.body.name,
            users,
            search,
            color: req.body.color,
        });

        const savedGroup = await newGroup.save();
        res.json(savedGroup);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/:groupId', authenticateToken, async (req, res) => {
    try {
        const specificGroup = await group.findById(req.params.groupId);
        res.json(specificGroup);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.delete('/:groupId', authenticateToken, async (req, res) => {
    try {
        const removedGroup = await group.deleteOne({
            _id: req.params.groupId
        });
        res.json(removedGroup)
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.patch('/:groupId', authenticateToken, async (req, res) => {
    try {
        const updatedGroup = await group.updateOne(
            {_id: req.params.groupId},
            {
                $set: req.body
            }
        );
        res.json(updatedGroup);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

module.exports = router;
