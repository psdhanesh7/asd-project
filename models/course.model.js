const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    co_no: {
        type: Number,
        default: null
    },
    dept_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department'
    },
    semester: {
        type: Number,
        default: null
    }
});

module.exports = mongoose.model('course', courseSchema);