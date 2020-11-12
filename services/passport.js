const LocalStrategy = require('passport-local').Strategy;
const db = require('../config/mysql');
const bcrypt = require('bcrypt');


module.exports = function(passport) {

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async function(username, password, done) {
            try {

                const GET_USER_QUERY = `SELECT * FROM faculty WHERE faculty_email = "${username}"`;
                const [ rows ] = await db.query(GET_USER_QUERY);
                const user = rows[0];

                if(!user) return done(null, false);

                const isMatch = await bcrypt.compare(password, user.faculty_password); 
                
                if(!isMatch) return done(null, false, { success: false, message: 'Invalid email or password' });
                return done(null, { id: user.faculty_id, admin: user.admin });
                
            } catch(err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser(function(user, next) {
        next(null, user.id);
    });
      
    passport.deserializeUser(async function(id, next) {

        try {

            const GET_USER_QUERY = `SELECT * FROM faculty WHERE faculty_id = ${id}`; 
            const [ rows ] = await db.query(GET_USER_QUERY);

            const user = rows[0];

            if(!user) return next(null, false);;
            next(null, { id: user.faculty_id, admin: user.admin });
        } catch(err) {
            next(err);
        }
    });
}