const router = require('express').Router();
const db = require('../config/mysql');

router.get('/', async (req, res) => {
    
    const { courseCode, year } = req.query;

    if(!courseCode || !year) return res.send({ success: false, message: 'Course code or year missing' });

    try {
        const GET_ASSIGNMENT_QUERY = `SELECT * FROM assignment WHERE course_code = '${courseCode}' AND year = ${year}`;
        const assignments = await db.query(GET_ASSIGNMENT_QUERY);

        return res.send({ success: true, assignments });

    } catch (err) {
        return res.send({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {

    const { courseCode, year, batch, assignmentNo, co1, co2, co3, co4, co5, co6 } = req.body;

    try {
        const ADD_ASSIGNEMNT_QUERY = `INSERT IGNORE INTO assignment (course_code, year, assignment_no, batch, co1, co2, co3, co4, co5, co6)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [courseCode, year, assignmentNo, batch, co1, co2, co3, co4, co5, co6 ];

        await db.query(ADD_ASSIGNEMNT_QUERY, values);

        return res.send({ success: true, message: 'Assignment added succesfully' });
    } catch(err) {
        return res.send({ success: false, message: err.message });
    }
});

router.put('/:assignmentId', async (req, res) => {
    
    const { courseCode, year, batch, assignmentNo, co1, co2, co3, co4, co5, co6 } = req.body;
    const { assignmentId } = req.params;

    try {
        const UPDATE_ASSIGNMENT_QUERY = `UPDATE assignmet
            SET course_code = ?, year = ?, batch = ?, assignment_no = ?, co1 = ?, co2 = ?, co3 = ?, co4 = ?, co5 = ?, co6 = ?
            WHERE assignment_id = ${assignmentId}`;
        const values = [ courseCode, year, batch, assignmentNo, co1, co2, co3, co4, co5, co6 ];

        await db.query(UPDATE_ASSIGNMENT_QUERY, values);

        return res.send({ success: true, message: 'Assignment updated succesfully' });
    } catch(err) {
        return res.send({ success: false, message: err.message });
    }

});

router.delete('/:assignmentId', async (req, res) => {

    const { assignmentId } = req.params;

    try {
        const DELETE_ASSIGNMENT_QUERY = `DELETE FROM assignment
            WHERE assignment_id = ${assignmentId}`;

        await db.query(DELETE_ASSIGNMENT_QUERY);

        return res.send({ success: true, message: 'Assignment deleted succefully' });
    } catch(err) {
        return res.send({ success: false, message: err.message });
    }

});

module.exports = router;