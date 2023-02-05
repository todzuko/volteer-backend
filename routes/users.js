const express = require('express');
const router = express.Router();
const user = require('../models/User');

//get all users
router.get('/', async (req, res) => {
    try {
        const users = await user.find();
        res.json(users);
    } catch (err) {
        res.json({
            message: err
        });
    }
}); // '/' cuz in app.js we specify that it's for /users

//sumbit a post
router.post('/', async (req, res) => {
    const newUser = new user({
        login: req.body.login,
        name: req.body.name,
        password: req.body.password,
        role: req.body.role,
    });

    try {
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//get specific user
router.get('/:userId', async (req, res) => {
    try {
        const specificUser = await user.findById(req.params.userId);
        res.json(specificUser);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//delete user
router.delete('/:userId', async (req, res) => {
    try {
        const removedUser = await user.deleteOne({
            _id: req.params.userId
        });
        res.json(removedUser)
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//update
router.patch('/:userId', async (req, res) => {
    try {
        const updatedUser = await user.updateOne(
            {_id: req.params.userId},
            {
                $set:
                    {
                        login: req.body.login,
                        name: req.body.name,
                        password: req.body.password,
                        role: req.body.role,
                    }
            }
        );
        res.json(updatedUser);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

module.exports = router;
