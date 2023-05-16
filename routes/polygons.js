const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Search = require('../models/Search');
const Polygon = require('../models/Polygon');
const {authenticateToken} = require('./auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const polygons = await Polygon.find().populate('group search');
        res.json(polygons);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const groupId = req.body.group;
    const searchId = req.body.search;

    try {
        const group = await Group.findById(groupId);
        const search = await Search.findById(searchId);
        if (!group || !search) {
            return res.status(400).json({message: 'related objects not found'});
        }

        const newPolygon = new Polygon({
            coordinates: req.body.coordinates,
            group,
            search,
        });

        const savedPolygon = await newPolygon.save();
        res.json(savedPolygon);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/search/:searchId', authenticateToken, async (req, res) => {
    try {
        const searchPolygons = await Polygon.find({search: req.params.searchId});
        res.json(searchPolygons);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.get('/group/:groupId', authenticateToken, async (req, res) => {
    try {
        const groupPolygon = await Polygon.find({group: req.params.groupId});
        res.json(groupPolygon);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.delete('/:polygonId', authenticateToken, async (req, res) => {
    try {
        const removedPolygon = await Polygon.deleteOne({
            _id: req.params.polygonId
        });
        res.json(removedPolygon)
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.patch('/:polygonId', authenticateToken, async (req, res) => {
    try {
        const updatedPolygon = await Polygon.updateOne(
            {_id: req.params.polygonId},
            {
                $set: req.body
            }
        );
        res.json(updatedPolygon);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

module.exports = router;
