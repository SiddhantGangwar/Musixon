//jshint esversion:6

//setting the .env file
require('dotenv').config();
// require modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

//using express
const app = express();

//setting body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//code so that css is also rendered with html pages
app.use(express.static("public"))

//setting ejs
app.set('view engine','ejs');

//setting up express-session
app.use(session({
  secret: "We will create the project",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//connectiong to mongodb collection(sql -> database)
mongoose.connect("mongodb://localhost:27107/musixon", {useNewUrlParse: true});
mongoose.set("useCreateIndex", true);

//require user model from models
const User = require("./models/user");

//setting more settings for passport

passport.use(User.createStrategy());

passport.serializeUser( (user, done) => {
  done(null, user.id);
});

passport.deserilizeUser( (id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
});


// code for google Oauth, see from lect 386
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/mainPage",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);
  //finds if user present or creates a new user
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));
// setup complete |fin|


app.get("/", (req, res) => {
  res.render("home");
});

// when logging in throug google btn, request will be made to auth/google
app.get("auth/google", (req, res) => {
  passport.authenticate('google', { scope: ["profile"] })
});


app.get("/mainPage", (req, res) => {
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("mainPage");
      }
    }
  });
})











//Listen at either port provided when deployed or 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});