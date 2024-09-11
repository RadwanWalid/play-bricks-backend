const router = require('express').Router();
const { isAuth } = require('./AuthMiddleware');
const passport = require('passport');

const { register, logout } = require('../controller/UserController');

router.get("/", (req, res) => {
  res.send("Hello Users");
})

router.post('/register', register)

router.get('/CheckAuth', isAuth, (req, res) => {
  res.status(200).send({ Error: false, Message: 'You are authorized' });
})
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.cookie('user', req.user.username, { maxAge: 14 * 24 * 3600000, httpOnly: true });
  const DetailsToSend = {
    username: req.user.username
  }
  res.status(200).send(DetailsToSend);
  // res.send("Logged in")
});

router.get('/logout', isAuth, logout);

module.exports = router;