const router = require('express').Router();
const passport = require('passport');

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