const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Group = require('../models/Group');
const Search = require('../models/Search');
const Polyline = require('../models/Polyline');
const {authenticateToken} = require('./auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const polyline = await Polyline.find().populate('user search');
        res.json(polyline);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.body.user;
    const searchId = req.body.search;

    try {
        const user = await User.findById(userId);
        const search = await Search.findById(searchId);
        if (!user || !search) {
            return res.status(400).json({message: 'related objects not found'});
        }

        const newPolyline = new Polyline({
            coordinates: req.body.coordinates,
            user,
            search,
        });

        const savedPolyline = await newPolyline.save();
        res.json(savedPolyline);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/search/:searchId', authenticateToken, async (req, res) => {
    try {
        const searchPolylines = await Polyline.find({search: req.params.searchId});
        res.json(searchPolylines);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.get('/group/:groupId', authenticateToken, async (req, res) => {
    try {
        const groupUsers = (await Group.findById( req.params.groupId ))['users']
        const groupPolygon = await Polyline.find({user: {$in: groupUsers}});
        res.json(groupPolygon);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.delete('/:polylineId', authenticateToken, async (req, res) => {
    try {
        const removedPolyline = await Polyline.deleteOne({
            _id: req.params.polylineId
        });
        res.json(removedPolyline)
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.patch('/:polylineId', authenticateToken, async (req, res) => {
    try {
        const updatedPolyline = await Polyline.updateOne(
            { _id: req.params.polylineId },
            {
                $set: req.body
            }
        );
        res.json(updatedPolyline);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

module.exports = router;
