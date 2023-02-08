const express = require('express');
const router = express.Router();
const group = require('../models/Group');
const Search = require('../models/Search');
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const groups = await group.find();
        const result = groups.map(group => ({
            id: group._id,
            name: group.name,
            users: group.users,
            color: group.color,
            search: group.search,
        }));
        res.json(result);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.post('/', async (req, res) => {
    const userIds = req.body.users;
    const searchId = req.body.search;

    try {
        const users = await User.find({_id: {$in: userIds}});
        const search = await Search.findById(searchId);
        if (!users || !search) {
            return res.status(400).json({message: 'related objects not found'});
        }

        const newGroup = new Group({
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

router.get('/:groupId', async (req, res) => {
    try {
        const specificGroup = await group.findById(req.params.groupId);
        res.json(specificGroup);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.delete('/:groupId', async (req, res) => {
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

router.patch('/:groupId', async (req, res) => {
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
