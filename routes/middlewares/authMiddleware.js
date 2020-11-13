module.exports = {

    authenticatedOnly : (req, res, next) => {
        if(req.isAuthenticated()) return next();
        // res.redirect('/auth/login');
        res.send({ message: 'You are not logged in' });
    },

    unauthenticatedOnly: (req, res, next) => {
        if(!req.isAuthenticated()) return next();
        // res.redirect('/dashboard');
        res.send({ success: false, message: 'You are logged in' });
    }
}