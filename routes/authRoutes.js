const router = require('express').Router();
const passport = require('passport');
const db = require('../config/mysql');

require('../services/passport')(passport);

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
});

router.get('/logout', (req, res) => {
    req.logout();
    res.json({ success: true, message: 'Logout successful' });
});

router.get('/currentUser', (req, res) => {
    res.send(req.user);
});

module.exports = router;