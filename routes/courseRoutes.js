const router = require('express').Router();
const db = require('../config/mysql');

router.post('/', async (req, res) => {

    const { courseCode, courseName, numberOfCos, deptId, semester } = req.body;
    const { co1, co2, co3, co4, co5, co6 } = req.body; 

    console.log(courseCode, courseName, numberOfCos, deptId, semester)

    const copoMatrix = [co1, co2, co3, co4, co5];
    if(co6) copoMatrix.push(co6);

    const records = [];

    for(let i = 0; i < copoMatrix.length; i++) {
        for(let j = 0; j < 12; j++) {
            if(copoMatrix[i] !== null) {
                const row = [courseCode, i+1, j+1, copoMatrix[i][j]];
                records.push(row);
            }
        }
    }

    console.log(records);

    const ADD_COURSE_QUERY = `INSERT INTO course(course_code, course_name, no_of_cos, dept_id, semester) VALUES (?, ?, ?, ?, ?)`;
    const values = [courseCode, courseName, numberOfCos, deptId, semester];

    const ADD_CO_PO_MATRIX_QUERY = `INSERT IGNORE INTO co_po_mapping VALUES ?`;

    const connection = await db.getConnection();
    try {
        await connection.query('START TRANSACTION');

        await connection.query(ADD_COURSE_QUERY, values);
        await connection.query(ADD_CO_PO_MATRIX_QUERY, [records]);

        await connection.query('COMMIT');
        await connection.release();

        res.send({ success: true, message: 'Course added successfully' });

    } catch (err) {
        await connection.query('ROLLBACK');
        await connection.release();
        
        res.send({ success: false, message: err.message });
    }

});



module.exports = router;