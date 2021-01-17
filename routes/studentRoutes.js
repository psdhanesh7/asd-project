const router = require('express').Router();
const db = require('../config/mysql');
const readXlsxFile = require('read-excel-file/node');
const upload = require('./middlewares/uploadFileMiddleware');

router.get('/', async (req, res) => {
    
    const { deptId, batch } = req.params;
    // if(!deptId || !batch) return res.send({ success: false, message: 'Department or batch year missing' });

    try {
        // const GET_STUDENT_LIST_QUERY = `SELECT * FROM student WHERE stud_dept_id = ${deptId} AND passout_year = ${batch}`;
        const GET_STUDENT_LIST_QUERY = `SELECT * FROM student`;

        const [ students ] = await db.query(GET_STUDENT_LIST_QUERY);
        return res.send({ success: true, students });

    } catch (err) {
        return res.send({ success: false, message: err.message });
    }

});

router.post('/enrollStudents', async (req, res) => {

    const { studentList, batch, courseCode, courseYear } = req.body;

    const records = [];

    for(let i = 0; i < studentList.length; i++) {
        const row = [studentList[i], courseCode, courseYear, batch];
        records.push(row);
    }
    console.log(records);

    try {
        const ENROLL_STUDENTS_QUERY = `INSERT IGNORE INTO student_enrollment (university_reg_no, course_code, year, batch) VALUES ?`;

        await db.query(ENROLL_STUDENTS_QUERY, [records]);
        res.send({ success: true, message: 'Course assigned successfully' });

    } catch (err) {        
        res.send({ success: false, message: err.message });
    }

});

// Needs to rethink about this route. Not at all efficient

router.delete('/', async (req, res) => {

    const passOutYear = req.body.passout;
    const id_list = req.body.ids;
    const courseCode = req.body.course_code;

    // console.log(records);

    const connection = await db.getConnection();
    
    try{
        await connection.query('START TRANSACTION');
        for(let i = 0; i < id_list.length; i++) {
            const UNASSIGN_STUDENT_QUERY = `DELETE FROM course WHERE course_code = "${courseCode}" and passout = "${passOutYear}" and student_id = "${id_list[i]}"`;
            await db.query(UNASSIGN_STUDENT_QUERY);
        }
        await connection.query('COMMIT');
        await connection.release();

        res.send({ success: true, message: 'Students unenrolled successfully' });

    } catch (err) {
        await connection.query('ROLLBACK');
        await connection.release();
        
        res.send({ success: false, message: err.message });
    }
});

router.post('/uploadStudentList', upload.single("file"), async (req, res) => {

    const { deptId, passoutYear } = req.body;

    if(!deptId || !passoutYear) return res.send({ success: false, message: 'Department or batch not provided' });

    try {

        if (req.file == undefined) return res.status(400).send("Please upload an excel file!");
    
        const path = __basedir + "/public/static/assets/uploads/" + req.file.filename;
        const students = await readXlsxFile(path);
        // skip header
        students.shift();
        
        const records = [];
        
        for(let i = 0; i < students.length; i++) {
            const row = [students[i][0], students[i][1], deptId, passoutYear];
            records.push(row);
        }

        console.log(records);

        const ADD_STUDENTS_QUERY = 'INSERT IGNORE INTO student VALUES ?';
        await db.query(ADD_STUDENTS_QUERY, [records]);

        return res.send({ success: true, message: 'Students added succesfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: err.message });
    }
});

module.exports = router;
