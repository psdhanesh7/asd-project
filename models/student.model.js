const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    university_reg_no: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    student_dept_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department'
    }
});

module.exports = mongoose.model('student', studentSchema);