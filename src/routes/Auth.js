const router = require('express').Router();
const passport = require('passport');
const passwordUtils = require('../lib/passwordUtils');
const connection = require('../config/database');
const genPassword = require('../lib/passwordUtils').genPassword;
const { Passport } = require('passport');
const { isAuth } = require('./AuthMiddleware');
const User = require('../models/UserSchema');

/**
 * -------------- POST ROUTES ----------------
 */

// TODO
router.post('/login', passport.authenticate('local', { failureRedirect: '/Auth/login-failure', successRedirect: '/Auth/login-success' }));

// TODO
router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
    });

    newUser.save()
        .then((user) => {
            console.log(user);
        });

    res.redirect('/Auth/login');
});

/**
* -------------- GET ROUTES ----------------
*/

router.get('/', (req, res, next) => {
    res.send('<h1>GuestPage</h1><p>Please <a href="/Auth/register">register</a></p>');
});


// When you visit https://play-bricks.vercel.app/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
    const form = '<h1>Login Page</h1><form method="POST" action="/Auth/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

// When you visit https://play-bricks.vercel.app/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="/Auth/register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth, (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    res.send('<h1>You are authenticated</h1><p><a href="/Auth/logout">Logout and reload</a></p>');

});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/Auth/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/Auth/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;