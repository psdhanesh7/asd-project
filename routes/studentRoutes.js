const router = require('express').Router();
const db = require('../config/mysql');
const readXlsxFile = require('read-excel-file/node');
const upload = require('./middlewares/uploadFileMiddleware');

router.get('/', (req, res) => {
    
    res.send('Student details');
});

router.post('/uploadStudentList', upload.single("file"), async (req, res) => {

    try {

        if (req.file == undefined) return res.status(400).send("Please upload an excel file!");
    
        const path = __basedir + "/public/static/assets/uploads/" + req.file.filename;
        const students = await readXlsxFile(path);
        // skip header
        // students.shift();
        return res.send(students);

        // Save the rows to database

    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Could not upload the file: " + req.file.originalname});
    }
});

module.exports = router;
