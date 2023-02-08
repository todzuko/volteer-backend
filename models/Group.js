const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    users: {
        default: [],
        required: true,
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    color: {
        type: String,
    },
    search: {
        type: Schema.Types.ObjectId,
        ref: 'Search'
    },
});

module.exports = mongoose.model('groups', groupSchema);
