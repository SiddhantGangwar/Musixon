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

// require path
var path = require('path');

//using express
const app = express();

//setting body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//setting ejs
app.set('view engine','ejs');


//code so that css is also rendered with html pages
//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

//setting up express-session
app.use(session({
  secret: "We will create the project",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//connectiong to mongodb collection(sql -> database)
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
//mongoose.set("useCreateIndex", true); // no need in latest moongoose version

//require user model from models
const User = require("./models/user");

//setting more settings for passport

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// code for google Oauth, see from lect 386
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://localhost:3000/auth/google/mainPage",
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
// setup complete ||| fin |||


app.get("/", (req, res) => {
  res.render("home");
});

// when logging in throug google btn, request will be made to auth/google
app.get("/auth/google", (req, res) => {
  passport.authenticate('google', { scope: ["profile"] })
});

app.get("/auth/google/mainPage",
  passport.authenticate("google", {failureRedirect: "login"}), 
  (req, res) => {
    // Successful authentication, redirect to Websites main page.
    res.redirect("mainPage");
  }
);

app.get("/mainPage", (req, res) => {
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.sendFile('views/mainPage.html', {root: __dirname })
      }
    }
  });
});



app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

/*app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});*/

app.post("/register", (req, res) => {

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/mainPage");
      });
    }
  });

});

app.post("/login", (req, res) => {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/mainPage");
      });
    }
  });

});


























//Listen at either port provided when deployed or 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});