const router = require('express').Router();
const db = require('../config/mysql');

function arrayer(coValues) {
    const coArray = [];
    for(let i = 0; i < coValues.length ; i++)
    {
        coArray.push(coValues[i].co1);
        coArray.push(coValues[i].co2);
        coArray.push(coValues[i].co3);
        coArray.push(coValues[i].co4);
        coArray.push(coValues[i].co5);
        coArray.push(coValues[i].co6);
    }
    return coArray;
}

function matrixer(copomatrix) {
    const matrix = [];
    for(let i = 0 ; i < copomatrix.length; i++)
        matrix.push(copomatrix[i].relation);
    return matrix;
}

router.get('/', async (req, res) => {
    const { semester, batch, facultyId } = req.query;

    if(facultyId) {
        try {
            const GET_COURSES_QUERY = `SELECT course_code, course_name FROM course_faculty NATURAL JOIN course WHERE faculty_id = ${facultyId}`;

            const [ courses ] = await db.query(GET_COURSES_QUERY);
            return res.send({ success: true, courses });
        } catch(err) {
            return res.send({ success: false, message: err.message });
        } 
    }

    let GET_COURSES_QUERY = `SELECT * FROM course`;
    if(semester && batch) {
        GET_COURSES_QUERY = `SELECT * FROM course INNER JOIN course_faculty ON course.course_code = course_faculty.course_code WHERE semester = ${semester} and passout_year = ${batch}`;
    }
    else if(semester) {
        GET_COURSES_QUERY = `SELECT course_code, course_name FROM course WHERE semester = ${semester}`
    }

    try{
        const [ courses ] = await db.query(GET_COURSES_QUERY);
        return res.send({ success: true, courses });

    } catch (err) {
        return res.send({ success: false, message: err.message });
    }
    
});

router.get('/:courseCode', async (req, res) => {

    // console.log('Request recieved')

    const { courseCode } = req.params;
    // console.log(courseCode)

    try {
        const GET_COURSE_DETAILS_QUERY = `SELECT * FROM course WHERE course_code = "${courseCode}"`;
        const [ rows ] = await db.query(GET_COURSE_DETAILS_QUERY);
        const course = rows[0];

        if(!course) return res.send({ success: false, message: 'No course with the given id' });

        const GET_CO_PO_MATRIX_QUERY = `SELECT co, po, relation
            FROM co_po_mapping
            WHERE course_code = "${courseCode}"`;

        const [ copoRecords ] = await db.query(GET_CO_PO_MATRIX_QUERY);

        let copoMatrix = [];
        for(let i = 0; i < course.no_of_cos; i++) {
            copoMatrix.push([]);
        }
        copoRecords.forEach(copo => {
            copoMatrix[copo.co - 1].push(copo.relation);
        });
        res.send({ success: true, course, copoMatrix });
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {

    const { courseCode, courseName, numberOfCos, deptId, semester } = req.body;
    const { co1, co2, co3, co4, co5, co6 } = req.body; 
    // console.log(courseCode, courseName, numberOfCos, deptId, semester)

    const copoMatrix = [co1, co2, co3, co4, co5, co6];

    const recordp = [];

    for(let i = 0; i < copoMatrix.length; i++) {
        for(let j = 0; j < 12; j++) {
            if(copoMatrix[i] !== null) {
                const row = [courseCode, i+1, j+1, copoMatrix[i][j]];
                recordp.push(row);
            }
        }
    }

    const ADD_COURSE_QUERY = `INSERT INTO course(course_code, course_name, no_of_cos, dept_id, semester) VALUES (?, ?, ?, ?, ?)`;
    const values = [courseCode, courseName, numberOfCos, deptId, semester];

    const ADD_CO_PO_MATRIX_QUERY = `INSERT IGNORE INTO co_po_mapping VALUES ?`;

    const connection = await db.getConnection();
    try {
        await connection.query('START TRANSACTION');

        await connection.query(ADD_COURSE_QUERY, values);
        await connection.query(ADD_CO_PO_MATRIX_QUERY, [recordp]);

        await connection.query('COMMIT');
        await connection.release();

        res.send({ success: true, message: 'Course added successfully' });

    } catch (err) {
        await connection.query('ROLLBACK');
        await connection.release();
        
        res.send({ success: false, message: err.message });
    }

});

router.delete('/:courseCode', async (req, res) => {

    const { courseCode } = req.params;

    try {
        const DELETE_COURSE_QUERY = `DELETE FROM course WHERE course_code = "${courseCode}"`;
        await db.query(DELETE_COURSE_QUERY);

        res.send({ success: true, message: 'Course successfully deleted' });
    } catch (err) {
        res.send({ success: false, message: err.message });
    }

});

router.post('/assignfaculty', async (req, res) => {
    
    const { courseCode } = req.body;
    const { facultyId, passoutYear, courseYear } = req.body;
    try {
        const ASSIGN_FACULTY_QUERY = `INSERT INTO course_faculty(course_code, course_year, faculty_id, passout_year) VALUES("${courseCode}", ${courseYear}, ${facultyId}, ${passoutYear})`;
        await db.query(ASSIGN_FACULTY_QUERY);

        res.send({ success: true, message: 'Faculty succesfully assigned' });
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

router.delete('/unassignfaculty', async (req, res) => {

    const { ids } = req.body;

    try {
        const UNASSIGN_FACULTY_QUERY = `DELETE FROM course_faculty
            WHERE id IN (${ids})`;

        await db.query(UNASSIGN_FACULTY_QUERY);

        return res.send({ success: true, message: 'Faculty unassigned succesfully' });

    } catch (err) {
        return res.send({ success: false, message: err.message });
    }
})

router.post('/postpo', async (req, res) => {

    // PO attainment completed

    const {passoutYear} = req.query;
    const FETCH_CO_VALUES_QUERY = `SELECT * FROM co_attainment where batch = ${passoutYear} ORDER by course_code`;
    const FETCH_CO_PO_MAPPING_QUERY = `SELECT relation FROM co_po_mapping ORDER BY course_code, co, po`;
    
    let copomatrix = [];
    let record = [];


    try {
       const [copomatrix]  = await db.query(FETCH_CO_PO_MAPPING_QUERY);
       const [record] = await db.query(FETCH_CO_VALUES_QUERY);
        // Converting query to array form

        const covalues = arrayer(record);
        const poMatrix = matrixer(copomatrix);

        const finalpos = []; //Contains final po valuescoValues.length

        for(let i = 0; i < 12; i++)
        {
            let interVal = 0;
            let weightVal = 0;
            for(let j = 0; j < covalues.length; j++)
            {
                interVal += covalues[j] * poMatrix[j * 12 + i]
                weightVal += poMatrix[j * 12 + i];
            }
            finalpos.push(interVal / weightVal)
        }

        const FEED_PO_VALUES_QUERY = `INSERT INTO po_attainment VALUES(${passoutYear}, ${finalpos[0]}, ${finalpos[1]}, ${finalpos[2]}, ${finalpos[3]}, ${finalpos[4]}, ${finalpos[5]}, ${finalpos[6]}, ${finalpos[7]}, ${finalpos[8]}, ${finalpos[9]}, ${finalpos[10]}, ${finalpos[11]})`;
        await db.query(FEED_PO_VALUES_QUERY);
        return res.send({ success: true, message: 'PO values inserted added succesfully' });
    }catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: err.message });
    }
});

module.exports = router;