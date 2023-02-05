const mongoose = require('mongoose');

const searchSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        default: Date.now(),
    },
    lostdate: {
        type: Date,
        default: Date.now(),
    },
    place: {
        type: String,
        required: true,
    },
    appearance: {
        type: String,
        required: true,
    },
    clothes: {
        type: String,
    },
    circumstances: {
        type: String,
    },
    special: {
        type: String,
    },
    photos: {
        type: String,
        default: 'photo',
        // required: true,
    },
});

module.exports = mongoose.model('search', searchSchema);
