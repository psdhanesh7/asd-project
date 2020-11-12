const LocalStrategy = require('passport-local').Strategy;


module.exports = function(passport) {

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async function(username, password, done) {
            try {
                const user = await User.findOne({ email: username });
                if(!user) return done(null, false);

                user.comparePassword(password, (err, isMatch) => {
                    if(err) return done(err);
                    if(!isMatch) return done(null, false, { success: false, message: 'Invalid email or password' });

                    return done(null, { id: user._id, admin: user.admin });
                });
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
            const user = await User.findById(id);
            if(!user) return next(null, false);;

            next(null, { id: user._id, admin: user.admin });
        } catch(err) {
            next(err);
        }
    });
}