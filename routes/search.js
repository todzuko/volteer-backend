const express = require('express');
const router = express.Router();
const search = require('../models/Search');
const {authenticateToken} = require('./auth');

//get all searches
router.get('/', authenticateToken, async (req, res) => {
    try {
        const searches = await search.find();
        const result = searches.map(search => ({
            id: search._id,
            name: search.name,
            birthday: search.birthday.toLocaleDateString('default', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, "."),
            lostdate: search.lostdate.toLocaleDateString('default', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, "."),
            place: search.place,
            appearance: search.appearance,
            special: search.special,
            circumstances: search.circumstances,
            clothes: search.clothes,
            photos: search.photos,
        }));
        res.json(result);
    } catch (err) {
        res.json({
            message: err
        });
    }
}); // '/' cuz in app.js we specify that it's for /searches

//sumbit a post
router.post('/', authenticateToken, async (req, res) => {
    const newSearch = new search({
        name: req.body.name,
        birthdate: req.body.birthdate,
        lostdate: req.body.lostdate,
        place: req.body.place,
        appearance: req.body.appearance,
        clothes: req.body.clothes,
        circumstances: req.body.circumstances,
        special: req.body.special,
        photos: req.body.photos,
    });

    try {
        const savedSearch = await newSearch.save();
        res.json(savedSearch);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//get specific search
router.get('/:searchId', authenticateToken, async (req, res) => {
    try {
        const specificSearch = await search.findById(req.params.searchId);
        const formattedBirthday = specificSearch.birthday.toLocaleDateString();
        const formattedLostdate = specificSearch.lostdate.toLocaleDateString();
        res.json({ ...specificSearch, birthday: formattedBirthday, lostdate: formattedLostdate });
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//delete search
router.delete('/:searchId', authenticateToken, async (req, res) => {
    try {
        const removedSearch = await search.deleteOne({
            _id: req.params.searchId
        });
        res.json(removedSearch)
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//update
router.patch('/:searchId', authenticateToken, async (req, res) => {
    try {
        const updatedSearch = await search.updateOne(
            {_id: req.params.searchId},
            {
                $set:
                    {
                        name: req.body.name,
                        birthdate: req.body.birthdate,
                        lostdate: req.body.lostdate,
                        place: req.body.place,
                        appearance: req.body.appearance,
                        clothes: req.body.clothes,
                        description: req.body.description,
                        special: req.body.special,
                        photos: req.body.photos,
                    }
            }
        );
        res.json(updatedSearch);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

module.exports = router;
