const mongoose = require('mongoose');

const courseFacultySchema = new mongoose.Schema({
    c_code: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    course_year: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'co_attainment'
    },
    course_faculty_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty'
    },
});

module.exports = mongoose.model('course_faculty', courseFacultySchema);