const
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/User')

// used to create cookies
passport.serializeUser((user, done) => {
    done(null, user._id)
})
 
// figure out who made request
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({ email: email}, (err, user) => {
        if(err) return done(err)
        if(user) return done(null, false, req.flash('signupMessage', 'That email is already taken'))
        User.create(req.body, (err, newUser) => {
            if(err) return done(err)
            return done(null, newUser)
        })
    })
}))

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({ email: email }, (err, user) => {
        if(err) return done(err)
        if(!user || !user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Email or Password incorrect'))
        return done(null, user)
    })
}))


module.exports = passport