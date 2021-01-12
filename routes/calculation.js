const passport = require("passport");
const db = require("../config/mysql");

function calcGrade(grade){
    if(grade === 'O')
        return 100;
    if(grade === 'A+')
        return 90;
    if(grade === 'A')
        return 85;
    if(grade === 'B+')
        return 80;
    if(grade === 'B')
        return 70;
    if(grade === 'C')
        return 60;
    if(grade === 'P')
        return 50;
    return 0;
}


//You can add route as you wish


function calculateCOPO(){

    const {courseCode, passoutYear} = req.body;
    const FETCH_CO_VALUES_QUERY = `SELECT * FROM co_attainment where course_code = "${courseCode}" and year = "${passoutYear}"`;
    const FETCH_CO_PO_MAPPING_QUERY = `SELECT relation FROM co_po_mapping  where course_code = "${courseCode} ORDER BY po, co"`;
    
    let copomatrix = [];
    let record = [];
    


    try {
        copomatrix  = await db.query(FETCH_CO_PO_MAPPING_QUERY);
        record = await db.query(FETCH_CO_VALUES_QUERY);
    
    } catch (err) {
        return res.send({ success: false, message: err.message });
    }

    // Converting query to array form

    let covalues = [];
    covalues.push(record[0].co1);
    covalues.push(record[0].co2);
    covalues.push(record[0].co3);
    covalues.push(record[0].co4);
    covalues.push(record[0].co5);
    covalues.push(record[0].co6);

    let finalpos = []; //Contains final po values

    let interSum = 0, divSum = 0, matrixlen = copomatrix.length;
    for(let i = 0 ; i < matrixlen; i++)
    {
        if(i % 6 && i != matrixlen - 1)
        {
            interSum += copomatrix[i].relation * covalues[i % 6];
            divSum += copomatrix[i].relation;
            continue;
        }
        finalpos.push(interSum / divSum);
        interSum = copomatrix[i].relation * covalues[i % 6];
        divSum = copomatrix[i].relation; 
    }
    
    const records = [];

    for(let i = 0; i < finalpos.length; i++) {
        const row = [i + 1, finalpos[i], courseCode, passoutYear];   // Records in the form po, value, course_code, year
        records.push(row);
    }

    const FEED_PO_VALUES_QUERY = 'INSERT IGNORE INTO po_attainment VALUES, ?';

    try{
        await db.query(FEED_PO_VALUES_QUERY, [records]);
        return res.send({ success: true, message: 'PO values inserted added succesfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: err.message });
    }
}

function COConsolidation(){
    const {courseCode, passoutYear} = req.body;
    
    const FETCH_CONSOLIDATED_IA1_QUERY = `SELECT AVG(co1), AVG(co2), AVG(co3), AVG(co4), AVG(co5), AVG(co6) FROM internal_exam_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND exam_no = 1`;
    const FETCH_CONSOLIDATED_IA2_QUERY = `SELECT AVG(co1), AVG(co2), AVG(co3), AVG(co4), AVG(co5), AVG(co6) FROM internal_exam_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND exam_no = 2`;
    const FETCH_CONSOLIDATED_ASMT1_QUERY = `SELECT AVG(co1), AVG(co2), AVG(co3), AVG(co4), AVG(co5), AVG(co6) FROM assignment_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND assignment_no = 1`;
    const FETCH_CONSOLIDATED_ASMT2_QUERY = `SELECT AVG(co1), AVG(co2), AVG(co3), AVG(co4), AVG(co5), AVG(co6) FROM assignment_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND assignment_no = 2`;
    const FETCH_CONSOLIDATED_ES_QUERY = `SELECT grade FROM end_sem_exam_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear}`;

    const internalExam1 = []
    const internalExam2 = []
    const assignment1 = []
    const assignment2 = []
    const endSemGrades = []

    try{
        internalExam1 = await db.query(FETCH_CONSOLIDATED_IA1_QUERY);
        internalExam2 = await db.query(FETCH_CONSOLIDATED_IA2_QUERY);
        assignment1 = await db.query(FETCH_CONSOLIDATED_ASMT1_QUERY);
        assignment2 = await db.query(FETCH_CONSOLIDATED_ASMT2_QUERY);
        endSemGrades = await db.query(FETCH_CONSOLIDATED_ES_QUERY);
    }catch(err){
        return res.send({ success: false, message: err.message });
    }

    

    // Evaluating End Sem CO

    let passPercent = 0;
    for(let i = 0 ; i < endSemGrades.length ; i++)
    {
        if(calcGrade(endSemGrades[i]) >= 60)
            passPercent++; 
    }

    passParcent /= endSemGrades.length;

    let endSemCO = 0;
    if(passPercent < 0.6)
        endSemCO = 0;
    else if(passPercent >= 0.6 && passPercent < 0.7)
        endSemCO = 1;
    else if(passPercent >= 0.7 && passPercent < 0.8)
        endSemCO = 2;
    else 
        endSemCO = 3;



}