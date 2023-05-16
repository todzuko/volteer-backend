const mongoose = require('mongoose');

const tracklineSchema = mongoose.Schema({
    search: {
        default: [],
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'search'
    },
    user: {
        default: [],
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    },
    coordinates: {
        type: [[Number]],
        required: true
    }
});

module.exports = mongoose.model('tracklines', tracklineSchema);