const mongoose = require('mongoose');

const polygonSchema = mongoose.Schema({
    group: {
        default: '',
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'groups'
    },
    search: {
        default: '',
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'search'
    },
    coordinates: {
        type: [[[Number]]],
        required: true
    }
});

module.exports = mongoose.model('polygons', polygonSchema);
