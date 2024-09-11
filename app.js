const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var AuthRoute = require('./src/routes/Auth');
var UserRoute = require('./src/routes/User');
var ModeRoute = require('./src/routes/Model');
const cors = require("cors");

const connection = require('./src/config/database');

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo')(session);

// Need to require the entire Passport config module so app.js knows about it
require('./src/config/passport');
/**
 * -------------- GENERAL SETUP ----------------
 */
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();
app.use(express.json({limit: '200mb'}));
app.use(express.urlencoded({limit: '200mb', extended: true }));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));



/**
 * 
 * 
 * -------------- SESSION SETUP ----------------
 */
const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'session' })
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  unset: 'destroy',
  cookie: { maxAge: 14 * 24 * 3600000 }


}))

// TODO

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */

app.get("/", (req, res) => {
  res.send("Hello backend")
})

app.use('/Auth', AuthRoute);
app.use('/User', UserRoute);
app.use('/Model', ModeRoute);

// Imports all of the routes from ./src/routes/index.js


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(5000);