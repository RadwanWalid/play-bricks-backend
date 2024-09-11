const { genPassword, validPassword } = require("../lib/passwordUtils");
const { default: mongoose, Model } = require('mongoose');
const User = require('../models/UserSchema');

async function register(req, res) {
    const saltHash = genPassword(req.body.password);
  
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    let EmailLowerCase = req.body.email.toLowerCase();
    var exists1 = await User.findOne({ "email": EmailLowerCase });
  
    var exists2 = await User.findOne({ "username": req.body.username });
    if (exists1 || exists2) {
      if (exists1 && exists2) {
        res.status(400).send("username and email already exist.");
      }
      else if (exists1) {
        res.status(400).send("email already exists.");
      }
      else {
        res.status(400).send("username already exists.");
      }
    }
    else {
      const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        email: EmailLowerCase,
      });
  
  
      newUser.save((err, newUser) => {
        if (err) {
          console.log(err);
          res.status(400).send("Error registering new user, please try again.");
        }
        else {
          res.cookie('user', newUser.username, { maxAge: 14 * 24 * 3600000, httpOnly: true });
          res.status(200).send("We are good to go!");
        }
  
      })
    }
};

function logout(req, res) {
  req.logout((err) => { if (err) res.status(400).send("Error logging out") });
  res.clearCookie('user');
  res.send("Logged out");
}

module.exports =  { register, logout };