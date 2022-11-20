//creating the model

//require mongoose
const mongoose = require("mongoose");
//require other modules
const findOrCreate = require('mongoose-findorcreate');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//create schema
const userSchema = new mongoose.Schema({
    userName: Number,
    userPassword: String,
    googleId: String
});

userSchema.plugin(passportLocalMongoose);   //does hash + salt + save in db
userSchema.plugin(findOrCreate);    //adds the find or create method in userSchema

//creating model
const User = mongoose.model("user", userSchema);
//export model
module.exports = User;