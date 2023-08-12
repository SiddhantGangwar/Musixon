import mongoose, { Schema } from "mongoose";

const tokenSchema = mongoose.Schema({
    userId : {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User",
        unique:true
    },
    token:{type:String,required:true},
    CreatedAt : {
        type : Date,
        default : new Date(),
        expires:3600
    }//expired in 1 hour 
});

export default mongoose.model("Token",tokenSchema);