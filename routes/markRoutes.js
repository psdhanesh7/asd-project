const router = require('express').Router();
const db = require('../config/mysql');
const readXlsxFile = require('read-excel-file/node');
const upload = require('./middlewares/uploadFileMiddleware');

router.post('/internalexam', upload.single('marklist'), async (req, res) => {

    const { courseCode, year, batch } = req.body;

    try {

        if (req.marklist == undefined) return res.status(400).send("Please upload an excel file!");
    
        const path = __basedir + "/public/static/assets/uploads/" + req.file.filename;
        const markList = await readXlsxFile(path);
        // skip header
        markList.shift();
        
        const records = [];
        
        for(let i = 0; i < markList.length; i++) {
            const row = [markList[i][0], markList[i][1], markList[i][2], markList[i][3]];
            records.push(row);
        }

        const ADD_STUDENTS_QUERY = 'INSERT IGNORE INTO student VALUES ?';
        await db.query(ADD_STUDENTS_QUERY, [records]);

        return res.send({ success: true, message: 'Students added succesfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: err.message });
    }


    res.send('internal marks upload')
});

router.post('/assignemt', (req, res) => {
    res.send('assignment marks upload')

});

router.post('/endsemexam', (req, res) => {
    res.send('endsem exam marks upload')

});

module.exports = router;