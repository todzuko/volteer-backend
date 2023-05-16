const express = require('express');
const router = express.Router();
const user = require('../models/User');
const {authenticateToken} = require('./auth');
const jwt = require("jsonwebtoken");

//get all users

router.get('/self', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded && decoded.userId;
    try {
        const userSelf = await user.findById(userId);
        res.json(userSelf);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.get('/', authenticateToken, async (req, res) => {
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
router.post('/', authenticateToken, async (req, res) => {
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
router.get('/:userId', authenticateToken, async (req, res) => {
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
router.delete('/:userId', authenticateToken, async (req, res) => {
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
router.patch('/:userId', authenticateToken, async (req, res) => {
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

// POST /login
router.post('/login', async (req, res) => {
    // Check if the user exists in the database
    const logUser = await user.findOne({ login: req.body.login });
    if (!logUser) return res.status(400).json({ error: 'Invalid username or password' });

    // Check if the password is correct
    // const validPassword = await bcrypt.compare(req.body.password, logUser.password);
    if (req.body.password !== logUser.password) return res.status(400).json({ error: 'Invalid username or password' });
    // if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });

    const accessToken = jwt.sign({ userId: logUser._id }, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken, role: logUser.role });
});


module.exports = router;
