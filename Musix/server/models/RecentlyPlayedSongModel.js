import mongoose, { Schema } from "mongoose";

const recentlyPlayedSchema = mongoose.Schema({
   userId : {type:Schema.Types.ObjectId,required:true,ref:"User",unique:true},
   songs : {type:Array,default:[]}
});

export default mongoose.model("recentlyPlayed",recentlyPlayedSchema);