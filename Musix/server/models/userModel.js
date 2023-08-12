import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name : {type : String , required: true},
  email : {type : String , required: true},
  password : {type : String , required: true},
  gender : {type : String},
  dob : {type : String},
  country : {type : String},
  lastPlayedSong : {type : Object},
  id : {type: String},
  verified:{type:Boolean,default:false},
  CreatedAt : {
    type : Date,
    default : new Date()
  }
});

export default mongoose.model("User",userSchema);