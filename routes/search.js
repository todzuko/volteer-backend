const express = require('express');
const router = express.Router();
const search = require('../models/Search');
const {authenticateToken} = require('./auth');
const {renderImage} = require("../services/pics/templateRender");
const path = require("path");
const {diskStorage} = require("multer");
//sumbit a post
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // specify the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // use the original file name for the uploaded file
    }
})

const upload = multer({ storage: storage })
router.get('/image/:searchId', async (req, res) => {
    try {
        const searchData = await search.findById(req.params.searchId);
        await renderImage(searchData)
        res.set('Content-Type', 'image/jpg');
        res.sendFile(path.resolve(__dirname + '/../services/pics/files/screenshot.jpg'));
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});

router.get('/count/', async (req, res) => {
    try {
        const searchData = await search.findById(req.params.searchId);
        await renderImage(searchData)
        res.set('Content-Type', 'image/jpg');
        res.sendFile(path.resolve(__dirname + '/../services/pics/files/screenshot.jpg'));
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});
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


router.post('/', authenticateToken, upload.array('photos'), async (req, res) => {
    const { name, birthday, lostdate, place, circumstances, clothes, appearance, special } = req.body;
    const photos = req.files.map(file => ({
        filename: file.originalname,
        uri: file.path,
    }));

    const newSearch = new search({
        name,
        birthdate: birthday,
        lostdate,
        place,
        appearance,
        clothes,
        circumstances,
        special,
        photos,
    });
console.log(name)
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
