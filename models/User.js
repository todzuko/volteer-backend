const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    login: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: 'baseUser',
    },
});

module.exports = mongoose.model('users', userSchema);
