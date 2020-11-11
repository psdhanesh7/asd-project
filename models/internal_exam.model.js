const mongoose = require('mongoose');
const { modelName } = require('./assignement.model');

const internalExamSchema = new mongoose.Schema({
    internal_course_code: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'co_attainment'
    },
    internal_exam_no: {
        type: Number,
        required: true
    },
    co1_total: {
        type: Double,
        required: true,
        default: 0
    },
    co2_total: {
        type: Double,
        required: true,
        default: 0
    },
    co3_total: {
        type: Double,
        required: true,
        default: 0
    },
    co4_total: {
        type: Double,
        required: true,
        default: 0
    },
    co5_total: {
        type: Double,
        required: true,
        default: 0
    },
    co6_total: {
        type: Double,
        required: true,
        default: 0
    },
    co1_attainment: {
        type: Double,
        required: true,
        default: 0
    },
    co2_attainment: {
        type: Double,
        required: true,
        default: 0
    },
    co3_attainment: {
        type: Double,
        required: true,
        default: 0
    },
    co4_attainment: {
        type: Double,
        required: true,
        default: 0
    },
    co5_attainment: {
        type: Double,
        required: true,
        default: 0
    },
    co6_attainment: {
        type: Double,
        required: true,
        default: 0
    },
});

module.exports = mongoose.model('internal_exam', internalExamSchema);
