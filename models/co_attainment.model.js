const mongoose = require('mongoose');

const coAttainmentSchema = new mongoose.Schema({
    course_code: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    year: {
        type: Number,
        required: true
    },
    co1: {
        type: Double,
        required: true,
        default: 0
    },
    co2: {
        type: Double,
        required: true,
        default: 0
    },
    co3: {
        type: Double,
        required: true,
        default: 0
    },
    co4: {
        type: Double,
        required: true,
        default: 0
    },
    co5: {
        type: Double,
        required: true,
        default: 0
    },
    co6: {
        type: Double,
        required: true,
        default: 0
    },
});

module.exports = mongoose.model('co_attainment', coAttainmentSchema);