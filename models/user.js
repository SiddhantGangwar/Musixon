//creating the model

//require mongoose
const mongoose = require(mongoose);
//create schema
const userSchema = new mongoose.schema({
    userName: Number,
    userPassword: String,
    googleId: String
});
//creating model
const user = mongoose.mpdel(user, userSchema);
//export model
module.exports = User;