const router = require('express').Router();
const db = require('../config/mysql');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    
    const { name, dept, email, password, admin } = req.body;
    
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt, null);

        const ADD_FACULTY_QUERY = `INSERT INTO faculty (faculty_name, dept_id, faculty_email, faculty_password, admin)
            VALUES ("${name}", ${dept}, "${email}", "${hashedPassword}", ${admin})`;

        await db.query(ADD_FACULTY_QUERY);

        res.send({ success: true, message: "Faculty added successfully" });
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

router.get('/', async (req, res) => {

    const { deptId } = req.query;
    const GET_FACULTY_QUERY = deptId ? `SELECT faculty_id, faculty_name  FROM faculty WHERE dept_id = ${deptId}` : `SELECT faculty_id, faculty_name, dept_id FROM faculty`;

    try {
        const [ faculty ] = await db.query(GET_FACULTY_QUERY);

        res.send({ success: true, faculty });
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
 
});

router.get('/:facultyId', async (req, res) => {

    const { facultyId } = req.params;
    const GET_FACULTY_BY_ID_QUERY = `SELECT faculty_id, faculty_name, dept_name
        FROM faculty, department
        WHERE faculty_id = ${facultyId}`;

    try {
        const [ faculty ] = await db.query(GET_FACULTY_BY_ID_QUERY);
        if(faculty.length === 0) return res.send({ success: false, message: 'No faculty with given id' });

        res.send({ success: true, faculty: faculty[0] });
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

router.delete('/:facultyId', async (req, res) => {

    const { facultyId } = req.params;
    const DELETE_FACULTY_QUERY = `DELETE FROM facylty WHERE faculty_id=${facultyId}`;

    try {
        await db.query(DELETE_FACULTY_QUERY);

        res.send({ success: true, message: 'Faculty deleted successfully' });
    } catch(err) {
        res.send({ success: false, message: err.message });
    }
})

module.exports = router;
