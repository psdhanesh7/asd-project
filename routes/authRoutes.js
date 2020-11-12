const router = require('express').Router();
const passport = require('passport');
const db = require('../config/mysql');

require('../services/passport')(passport);


// router.post('/login', async (req, res) => {

//     const { email, password } = req.body;

//     try {

//         const GET_USER_QUERY = `SELECT * FROM faculty WHERE faculty_email = "${email}"`;
//         const [ user ] = await db.query(GET_USER_QUERY);
    
//         res.send(user);

//         console.log(user[0]);

//     } catch (err) {
//         res.send({ success: false, message: err.message });
//     }

// });

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/auth/loginFailure'
    }),
    (req, res) => {
        return res.send({ success: true, user: req.user });
    }
);

router.get('/loginFailure', (req, res) => {
    res.send('Login failed');
})

module.exports = router;