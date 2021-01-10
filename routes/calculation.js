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
    const FETCH_CO_VALUES_QUERY = `SELECT * FROM final_co where course_code = "${courseCode}"`;
    const FETCH_CO_PO_MAPPING_QUERY = `SELECT * FROM final_co where co_po_mapping = "${courseCode}"`;
    
}