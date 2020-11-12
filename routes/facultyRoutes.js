const router = require('express').Router();
const db = require('../config/mysql');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    
    const { name, dept, email, password, admin } = req.body;
    
    try {
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt, null);

        const ADD_FACULTY_QUERY = `INSERT INTO faculty (faculty_name, dept_id, faculty_email, faculty_password, admin)
            VALUES ("${name}", ${dept}, "${email}", "${hashedPassword}", ${admin})`;

        await db.query(ADD_FACULTY_QUERY);

        res.send({ success: true, message: "Faculty added successfully" });
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

router.get('/', async (req, res) => {


})

module.exports = router;
