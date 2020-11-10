const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    dept_name: {
        type: String,
        required: true,
    },
    hod_fac_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty'
    }
});

module.exports = mongoose.model('department', departmentSchema);