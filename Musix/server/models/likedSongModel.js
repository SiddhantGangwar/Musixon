import mongoose , {Schema} from "mongoose";

const likedSongSchema = mongoose.Schema({
   userId : {type:Schema.Types.ObjectId,required:true,ref:"User", unique:true},
   songs : {type:Array,default:[]},
   CreatedAt:{type:Date,default:new Date()}
});

export default mongoose.model("likedSong",likedSongSchema);