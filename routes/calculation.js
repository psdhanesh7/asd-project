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


function arrayer(coValues) {
    const coArray = [];
    coArray.push(coValues.co1);
    coArray.push(coValues.co2);
    coArray.push(coValues.co3);
    coArray.push(coValues.co4);
    coArray.push(coValues.co5);
    coArray.push(coValues.co6);

    return coArray;
}

//You can add route as you wish

function avgArray(coArray1, coArray2, multiplier) {
    const resultArray = [];
    for(let i = 0 ; i < 6 ; i++) {
        if(coArray1[i] == 0 || coArray2[i] == 0)
            resultArray.push(coArray1[i] + coArray2[i]);
        else
            resultArray.push(coArray1[i] * multiplier + coArray2[i] * (1 - multiplier));
    }
    return avgArray;
}


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

    const covalues = arrayer(record[0]);

    const finalpos = []; //Contains final po values

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

    let internalExam1 = []
    let internalExam2 = []
    let assignment1 = []
    let assignment2 = []
    let endSemGrades = []

    try{
        internalExam1 = await db.query(FETCH_CONSOLIDATED_IA1_QUERY);
        internalExam2 = await db.query(FETCH_CONSOLIDATED_IA2_QUERY);
        assignment1 = await db.query(FETCH_CONSOLIDATED_ASMT1_QUERY);
        assignment2 = await db.query(FETCH_CONSOLIDATED_ASMT2_QUERY);
        endSemGrades = await db.query(FETCH_CONSOLIDATED_ES_QUERY);
    }catch(err){
        return res.send({ success: false, message: err.message });
    }

    // Evaluating Continuous Evaluation CO

    internalExam1 = arrayer(internalExam1[0]);
    internalExam2 = arrayer(internalExam2[0]);
    assignment1 = arrayer(assignment1[0]);
    assignment2 = arrayer(assignment2[0]);

    const continousEval = avgArray(avgArray(internalExam1, internalExam2, 0.5), avgArray(assignment1, assignment2, 0,5), 0.6);

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

    const endSemValues = [endSemCO, endSemCO, endSemCO, endSemCO, endSemCO, endSemCO];

    // Evaluating Final CO Attainment

    const finalValues = avgArray(endSemValues, continousEval, 0.6); // Final value array contains consolidated COs


}