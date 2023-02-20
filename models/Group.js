const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    users: {
        default: [],
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    },
    color: {
        type: String,
    },
    search: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'search'
    },
});

module.exports = mongoose.model('groups', groupSchema);
