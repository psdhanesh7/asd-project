const router = require('express').Router();
const db = require('../config/mysql');
const readXlsxFile = require('read-excel-file/node');
const upload = require('./middlewares/uploadFileMiddleware');

router.get('/', (req, res) => {
    
    res.send('Student details');
});

router.post('/', (req, res) => {
    const passOutYear = req.body.passout;
    const id_list = req.body.ids;
    const courseCode = req.body.course_code;

    const records = [];

    for(let i = 0; i < id_list.length; i++) {
        const row = [courseCode, id_list[i], passOutYear];
        records.push(row);
    }
    console.log(records);

    const ASSIGN_COURSE_QUERY = `INSERT IGNORE INTO course_assignment VALUES ?`;

    const connection = await db.getConnection();
    try {
        await connection.query('START TRANSACTION');

        await connection.query(ASSIGN_COURSE_QUERY, [records]);

        await connection.query('COMMIT');
        await connection.release();

        res.send({ success: true, message: 'Course assigned successfully' });

    } catch (err) {
        await connection.query('ROLLBACK');
        await connection.release();
        
        res.send({ success: false, message: err.message });
    }

});

router.delete('/', async (req, res) => {

    const passOutYear = req.body.passout;
    const id_list = req.body.ids;
    const courseCode = req.body.course_code;

    console.log(records);
    try {
        for(let i = 0; i < id_list.length; i++) {
            const UNASSIGN_STUDENT_QUERY = `DELETE FROM course WHERE course_code = "${courseCode}" and passout = "${passOutYear}" and student_id = "${id_list[i]}"`;
            await db.query(UNASSIGN_STUDENT_QUERY);
        }
        res.send({ success: true, message: 'Students successfully unassigned!' });
    } catch (err) {
        res.send({ success: false, message: err.message });
    }

});

router.post('/uploadStudentList', upload.single("file"), async (req, res) => {

    try {

        if (req.file == undefined) return res.status(400).send("Please upload an excel file!");
    
        const path = __basedir + "/public/static/assets/uploads/" + req.file.filename;
        const students = await readXlsxFile(path);
        // skip header
        // students.shift();
        const ADD_STUDENTS_QUERY = 'INSERT IGNORE INTO student VALUES ?';
        
        const records = [];
        
        for(let i = 0; i < students.length; i++) {
            const row = [students[i].university, students[i].name, students[i].deptid, students[i].batch];
                records.push(row);

        const connection = await db.getConnection();
        try{
            await connection.query('START TRANSACTION');
            await connection.query(ADD_STUDENTS_QUERY, [records]);
            await connection.query('COMMIT');
            await connection.release();
    
            res.send({ success: true, message: 'Students added successfully' });
    
        } catch (err) {
            await connection.query('ROLLBACK');
            await connection.release();
            
            res.send({ success: false, message: err.message });
        }
    }

    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Could not upload the file: " + req.file.originalname});
    }
});

module.exports = router;
