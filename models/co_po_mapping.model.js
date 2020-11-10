const mongoose = require('mongoose');

const copoMappingSchema = new mongoose.Schema({
    code: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    mapping: {
        type: [[Number]],
        required: true
    }
});

module.exports = mongoose.model('co_po_mapping', copoMappingSchema);