const mongoose = require('mongoose');

const endSemExamSchema = new mongoose.Schema({
    course_code: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'co_attainment'
    },
    co_attained: {
        type: Double,
        default: 0
    }
});

module.exports = mongoose.model('end_sem_exam', endSemExamSchema);
