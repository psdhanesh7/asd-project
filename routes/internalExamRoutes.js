const router = require('express').Router();
const db = require('../config/mysql');

router.get('/', async (req, res) => {

    const { courseCode, year } = req.query;

    if(!courseCode || !year) return res.send({ success: false, message: 'Course code or year missing' });

    try {
        const GET_INTERNAL_EXAMS_QUERY = `SELECT * FROM internal_exam 
            WHERE course_code = '${courseCode}' AND year = ${year}`;

        const internalExams = await db.query(GET_INTERNAL_EXAMS_QUERY);

        return res.send({ success: true, internalExams });
    } catch(err) {
        return res.send({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {

    const { courseCode, year, batch, internalExamNo, co1, co2, co3, co4, co5, co6 } = req.body;

    try {
        const INSERT_INTERNAL_EXAM_QUERY = `INSERT IGNORE 
            INTO internal_exam (course_code, year, batch, internal_exam_no, co1, co2, co3, co4, co5, co6 )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [ courseCode, year, batch, internalExamNo, co1, co2, co3, co4, co5, co6 ];

        await db.query(INSERT_INTERNAL_EXAM_QUERY, values);

        return res.send({ success: true, message: 'Internal exam succesfully added' });
    } catch(err) {
        return res.send({ success: false, message: err.message });
    }
});

router.put('/:internalExamId', async (req, res) => {

    const { internalExamId } = req.params;
    const { courseCode, year, batch, internalExamNo, co1, co2, co3, co4, co5, co6 } = req.body;

    try {
        const EDIT_INTERNAL_EXAM_QUERY = `UPDATE internal_exam
            SET course_code = ?, year = ?, batch = ?, internal_exam_no = ?, co1 = ?, co2 = ?, co3 = ?, co4 = ?, co5 = ?, co6 = ?
            WHERE internal_exam_id = ${internalExamId}`;
        const values = [courseCode, year, batch, internalExamNo, co1, co2, co3, co4, co5, co6];

        await db.query(EDIT_INTERNAL_EXAM_QUERY, values);

        return res.send({ success: true, message: 'Internal exam updated successfully' });
    } catch (err) {
        return res.send({ success: false, message: err.message });
    }

});

router.delete('/:internalExamId', async (req, res) => {

    const { internalExamId } = req.params;

    try {
        const DELETE_INTERNAL_EXAM_QUERY = `DELETE FROM internal_exam
            WEHRE internal_exam_id = ${internalExamId}`;

        await db.query(DELETE_INTERNAL_EXAM_QUERY);

        return res.send({ success: true, message: 'Internal exam deleted succefully '});
    } catch(err) {
        return res.send({ success: false, message: err.message });
    }
});

module.exports = router;