const router = require('express').Router();
const db = require('../config/mysql');
const readXlsxFile = require('read-excel-file/node');
const upload = require('./middlewares/uploadFileMiddleware');

router.post('/internalexam', upload.single('file'), async (req, res) => {

    console.log('Request accepted');

    const { courseCode, year, batch, internalExamNo } = req.body;

    console.log(courseCode);
    console.log(year);
    console.log(batch);
    console.log(internalExamNo);

    try {

        console.log(req.file);

        if (req.file == undefined) return res.status(400).send("Please upload an excel file!");

        console.log('First check passed')
    
        const path = __basedir + "/public/static/assets/uploads/" + req.file.filename;
        const markList = await readXlsxFile(path);
        // skip header
        markList.shift();
        
        const records = [];
        
        // Note : Assumed that all courses have 6 COs

        for(let i = 0; i < markList.length; i++) {
            const row = [
                courseCode,
                year,
                markList[i][0], // University Reg No
                internalExamNo,
                batch,
                markList[i][1], // CO1
                markList[i][2], // CO2
                markList[i][3], // CO3
                markList[i][4], // CO4
                markList[i][5], // CO5
                markList[i][6]  // CO6 
            ];
            records.push(row);
        }

        console.log(records);

        const ADD_INTERNAL_MARKS_QUERY = 'INSERT IGNORE INTO internal_exam_marks VALUES ?';
        await db.query(ADD_INTERNAL_MARKS_QUERY, [records]);

        console.log('File uploaded succefully');

        return res.send({ success: true, message: 'Marks added succesfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: err.message });
    }

});

router.post('/assignment', upload.single('file'), async (req, res) => {

    const { courseCode, year, batch, assignmentNo } = req.body;

    try {

        if (req.file == undefined) return res.status(400).send("Please upload an excel file!");
    
        const path = __basedir + "/public/static/assets/uploads/" + req.file.filename;
        const markList = await readXlsxFile(path);
        // skip header
        markList.shift();
        
        const records = [];
        
        // Note : Assumed that all courses have 6 COs

        for(let i = 0; i < markList.length; i++) {
            const row = [
                courseCode,
                year,
                markList[i][0], // University Reg No
                assignmentNo,
                batch,
                markList[i][1], // CO1
                markList[i][2], // CO2
                markList[i][3], // CO3
                markList[i][4], // CO4
                markList[i][5], // CO5
                markList[i][6]  // CO6 
            ];
            records.push(row);
        }

        console.log(records);

        const ADD_ASSIGNMENT_MARKS_QUERY = 'INSERT IGNORE INTO assignment_marks VALUES ?';
        await db.query(ADD_ASSIGNMENT_MARKS_QUERY, [records]);

        return res.send({ success: true, message: 'Assignment Marks added succesfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: err.message });
    }
});

router.post('/endsemexam', upload.single('file'), async (req, res) => {
    
    const { year, batch } = req.body;

    try {

        if (req.file == undefined) return res.status(400).send("Please upload an excel file!");
    
        const path = __basedir + "/public/static/assets/uploads/" + req.file.filename;
        const markList = await readXlsxFile(path);
        // skip header
        // markList.shift();

        const headers = markList[0];
        markList.shift();

        console.log(headers);

        const course1 = headers[1];
        const course2 = headers[2];
        const course3 = headers[3];
        const course4 = headers[4];
        const course5 = headers[5];
        const course6 = headers[6];
        
        const records = [];
        
        // Note : Assumed that all courses have 6 COsbcfbjvngfcp

        for(let i = 0; i < markList.length; i++) {
             
            records.push([ course1, year, markList[i][0], batch, markList[i][1]]);
            records.push([ course2, year, markList[i][0], batch, markList[i][2]]);
            records.push([ course3, year, markList[i][0], batch, markList[i][3]]);
            records.push([ course4, year, markList[i][0], batch, markList[i][4]]);
            records.push([ course5, year, markList[i][0], batch, markList[i][5]]);
            records.push([ course6, year, markList[i][0], batch, markList[i][6]]);
    
        }

        console.log(records);

        const ADD_END_SEM_EXAM_MARKS_QUERY = 'INSERT IGNORE INTO end_sem_exam_marks VALUES ?';
        await db.query(ADD_END_SEM_EXAM_MARKS_QUERY, [records]);

        return res.send({ success: true, message: 'Assignment Marks added succesfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: err.message });
    }

});

module.exports = router;