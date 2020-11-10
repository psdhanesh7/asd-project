const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    faculty_name: {
        type: String,
        required: true
    },
    dept_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department'
    },
    faculty_email: {
        type: String,
        required: true,
    },
    faculty_password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('faculty', facultySchema);