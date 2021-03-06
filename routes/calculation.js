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

// CO Consolidation Part

function coValueGen(passPercent)
{
    if(passPercent < 0.6)
        return 0;
    if(passPercent < 0.7)
        return 1;
    if(passPercent < 0.8)
        return 2;
    return 3;
}

function consolidator(coValarray, coTotarray) {
    
    const resultArray = [0, 0, 0, 0, 0, 0];
    let arrLength = coValarray.length;
    for(let i = 0 ; i < arrlength ; i++)
    {
        if(coValarray[i].co1 / coTotarray.co1 >= 0.6)
            resultArray[0]++;
        if(coValarray[i].co2 / coTotarray.co2 >= 0.6)
            resultArray[1]++;
        if(coValarray[i].co3 / coTotarray.co3 >= 0.6)
            resultArray[2]++;
        if(coValarray[i].co4 / coTotarray.co4 >= 0.6)
            resultArray[3]++;
        if(coValarray[i].co5 / coTotarray.co5 >= 0.6)
            resultArray[4]++;
        if(coValarray[i].co6 / coTotarray.co6 >= 0.6)
            resultArray[5]++;
    }

    resultArray[0] = coValueGen(resultArray[0] / arrLength);
    resultArray[1] = coValueGen(resultArray[1] / arrLength);
    resultArray[2] = coValueGen(resultArray[2] / arrLength);
    resultArray[3] = coValueGen(resultArray[3] / arrLength);
    resultArray[4] = coValueGen(resultArray[4] / arrLength);
    resultArray[5] = coValueGen(resultArray[5] / arrLength);

    return resultArray;
}

function COConsolidation() {

    const {courseCode, passoutYear} = req.body;
    
    const FETCH_CONSOLIDATED_IA1_QUERY = `SELECT co1, co2, co3, co4, co5, co6 FROM internal_exam_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND exam_no = 1`;
    const FETCH_CONSOLIDATED_IA2_QUERY = `SELECT co1, co2, co3, co4, co5, co6 FROM internal_exam_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND exam_no = 2`;
    const FETCH_IA1_TOTAL_QUERY = `SELECT co1, co2, co3, co4, co5, co6 FROM internal_exam WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND exam_no = 1`;
    const FETCH_IA2_TOTAL_QUERY = `SELECT co1, co2, co3, co4, co5, co6 FROM internal_exam WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND exam_no = 2`;
    const FETCH_CONSOLIDATED_ASMT1_QUERY = `SELECT co1, co2, co3, co4, co5, co6 FROM assignment_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND assignment_no = 1`;
    const FETCH_CONSOLIDATED_ASMT2_QUERY = `SELECT co1, co2, co3, co4, co5, co6 FROM assignment_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND assignment_no = 2`;
    const FETCH_ASMT1_TOTAL_QUERY = `SELECT co1, co2, co3, co4, co5, co6 FROM assignment_ WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND assignment_no = 1`;
    const FETCH_ASMT2_TOTAL_QUERY = `SELECT co1, co2, co3, co4, co5, co6 FROM assignment WHERE course_code = "${courseCode}" AND batch = ${passoutYear} AND assignment_no = 2`;
    const FETCH_CONSOLIDATED_ES_QUERY = `SELECT grade FROM end_sem_exam_marks WHERE course_code = "${courseCode}" AND batch = ${passoutYear}`;

    try{
      const [internalExam1] = await db.query(FETCH_CONSOLIDATED_IA1_QUERY);
      const [internalExam2] = await db.query(FETCH_CONSOLIDATED_IA2_QUERY);
      const [internalExam1Total] = await db.query(FETCH_IA1_TOTAL_QUERY);
      const [internalExam2Total] = await db.query(FETCH_IA2_TOTAL_QUERY);
      const [assignment1] = await db.query(FETCH_CONSOLIDATED_ASMT1_QUERY);
      const [assignment2] = await db.query(FETCH_CONSOLIDATED_ASMT2_QUERY);
      const [assignment1Total] = await db.query(FETCH_ASMT1_TOTAL_QUERY);
      const [assignment2Total] = await db.query(FETCH_ASMT2_TOTAL_QUERY);
      const [endSemGrades] = await db.query(FETCH_CONSOLIDATED_ES_QUERY);

    // Evaluating Continuous Evaluation CO

      internalExam1 = consolidator(internalExam1, internalExam1Total[0]);
      internalExam2 = consolidator(internalExam2, internalExam2Total[0]);
      assignment1 = consolidator(assignment1, assignment1Total[0]);
      assignment2 = consolidator(assignment2, assignment2Total[0]);

      const continousEval = avgArray(avgArray(internalExam1, internalExam2, 0.5), avgArray(assignment1, assignment2, 0,5), 0.6);

    // Evaluating End Sem CO

      let passPercent = 0;
      for(let i = 0 ; i < endSemGrades.length ; i++)
      {
        if(calcGrade(endSemGrades[i].grade) >= 60)
            passPercent++; 
      }

      passParcent /= endSemGrades.length;

      const endSemCO = coValGen(passPercent);
      const endSemValues = [endSemCO, endSemCO, endSemCO, endSemCO, endSemCO, endSemCO];

      // Evaluating Final CO Attainment

      const finalValues = avgArray(endSemValues, continousEval, 0.6); // Final value array contains consolidated COs

      } catch(err) {
        return res.send({ success: false, message: err.message });
    }

}