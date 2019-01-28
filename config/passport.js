
const
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    User = require('../models/User');
   
// Serialize  and deserialize
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// my middleware :)
passport.use('local-login', new localStrategy({
    usernameField:  'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email }, (err, user) => {
        if(err) return done(err);
        if(!user) {
            return done(null,false, req.flash('loginMessage', 'کاربری با این مشخصات یافت نشد'));
        }
        if(!user.comparePassword(password)) {
            return done(null, false, req.flash('loginMessage', 'نام کاربری یا رمز عبور صحیح نمی باشد'));
        }
        return done (null, user);
    });
}));

// Custom Function
exports.isAuthenticated = (req, res, done) => {
if (req.isAuthenticated()) {
    return done();
    }
    res.redirect('/login');
}