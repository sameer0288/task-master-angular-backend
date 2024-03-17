const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');

passport.use(
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            User.findOne({ email: username },
                async (err, user) => {
                    if (err)
                        return done(err);
                    else if (!user)
                        return done(null, false, { message: 'Email is not registered' });
                    else {
                        const verified = await user.verifyPassword(password);
                        if (verified)
                            return done(null, user);
                        else
                            return done(null, false, { message: 'Wrong password.' });
                    }
                });
        })
);