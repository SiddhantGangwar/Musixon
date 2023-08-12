import mongoose, { Schema } from "mongoose";

const playListSchema = mongoose.Schema({
   userId : {type:Schema.Types.ObjectId,required:true,ref:"User",unique:true},
   playList : {type:Array,default:[]}
});

export default mongoose.model("userPlayList",playListSchema);