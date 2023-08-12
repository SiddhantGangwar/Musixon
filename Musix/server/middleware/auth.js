import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
//what middleware for ? ex:-
//click on the liked song button => auth middleware (next) => like controller 
export const auth = async(req,res,next) =>{
    try {
       const token = req.cookies.jwtoken;
       let decodedData;
       if(token){
        decodedData = jwt.verify(token,process.env.SECRET_KEY);//give data for each specific token like username and id
        req.userId = decodedData?.id;
        next();
       }else{
        res.status(400).json({message:"Unauthorized User"});
       }
    } catch (error) {
      res.status(500).json({message : "Something went wrong! Try Again!!"}); 
    }
}

export const verifyUser = async(req,res,next) =>{
  const {token} = req.body;
  try {
    const decodedData = jwt.verify(token,process.env.SECRET_KEY);
    const id = decodedData?.id;
    if(id){
      const existingUser = await User.findOne({_id:id});
      if(existingUser) res.status(200).json({result : existingUser, status:"ok"});
      else res.status(400).json({message:"Unauthorized User"});
    }else{
      res.status(400).json({message:"Unauthorized User"});
    }
    next();
  }catch (error) {
    res.status(500).json({message:"Internal Server Error! Try Again!!"}); 
    next();
  }
}