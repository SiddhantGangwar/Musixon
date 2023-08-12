import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import likedSong from "../models/likedSongModel.js";
import userPlayList from "../models/playListModel.js";
import recentlyPlayed from "../models/RecentlyPlayedSongModel.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import {OAuth2Client} from "google-auth-library";

const client = new OAuth2Client(process.env.OAUTHCLIENTID);

export const login = async (req,res) =>{
  const {email,password} = req.body;
    try{
      const existingUser = await User.findOne({email});
      if(!existingUser) return res.status(404).json({message:"User doesn't exist"});
      const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
      if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials!"});
      if(!existingUser.verified){
        let eToken = await Token.findOne({userId:existingUser._id});
        if(!eToken){
          eToken = await Token.create({userId:existingUser._id,token:crypto.randomBytes(32).toString("hex")});
          const url = `${process.env.BASE_URL}user/${existingUser._id}/verify/${eToken.token}`;
          await sendEmail(existingUser.email,"MUSIXON!! Verify Your Email",url);
        }
        return res.status(400).json({message:"Verify Your Email First."});
      }
      const token = jwt.sign({email:existingUser.email,id:existingUser._id},process.env.SECRET_KEY,{expiresIn:"7d"});
      //for 1 week
      //set cors optional property to set cookie into the frontend browser
      res.cookie("jwtoken",token,{expires : new Date(Date.now()+604800000),httpOnly: false});
      res.status(200).json({result: existingUser,token});
    } catch (error) {
      res.status(500).json({message : "Internal Server Error! Try Again!!"});
    }
}

export const signup = async (req,res) => {
    const {name,email,password,confirmpassword} = req.body;
    try {
      const existingUser = await User.findOne({email});
      if(existingUser) return res.status(400).json({message:"User already exist."});
      if(password!==confirmpassword) return res.status(400).json({message:"Password doesn't match."});
      const hashedPassword = await bcrypt.hash(password,12);
      const result = await User.create({name,email,password:hashedPassword});
      const eToken = await Token.create({userId:result._id,token:crypto.randomBytes(32).toString("hex")});
      const url = `${process.env.BASE_URL}user/${result._id}/verify/${eToken.token}`;
      await sendEmail(result.email,"MUSIXON!! Verify Your Email",url);
      const token = jwt.sign({email:result.email,id:result._id},process.env.SECRET_KEY,{expiresIn:"7d"});
      res.status(201).json({result,token,message:"Verify Your Email First."});
    } catch (error) {
      res.status(500).json({message : "Internal Server Error! Try Again!!"});
    }
}

export const verificationLink = async(req,res) =>{
  const {id,etoken} = req.body;
  try {
    const existingUser = await User.findOne({_id:id});
    if(!existingUser) return res.status(400).json({message:"Invalid Link Id Not Match"});
    const getToken = await Token.findOne({userId:id,token:etoken});
    if(!getToken) return res.status(400).json({message:"Invalid Link Token Not Match"});
    await User.updateOne({_id:id},{$set:{verified:true}});
    await Token.deleteOne({userId:id});
    res.status(200).json({message:"Email Verified Successfully"});
  } catch (error) {
    res.status(500).json({message : "Internal Server Error! Try Again!!"});   
  }
}

export const googleLogin = async(req,res)=>{
  const {tokenId} = req.body;
  try {
    //verify token from frontend and backend
    const verifyToken = await client.verifyIdToken({idToken:tokenId,audience:process.env.OAUTHCLIENTID});
    const {email_verified,name,email} = verifyToken.payload;
    const existingUser = await User.findOne({email});
    if(!existingUser){
      const password = email+process.env.SECRET_KEY;
      const hashedPassword = await bcrypt.hash(password,12);
      const result = await User.create({name,email,password:hashedPassword,verified:email_verified});
      const token = jwt.sign({email:result.email,id:result._id},process.env.SECRET_KEY,{expiresIn:"7d"});
      res.cookie("jwtoken",token,{expires : new Date(Date.now()+604800000),httpOnly: false});
      res.status(201).json({result,token});
    }
    else{
      if(!existingUser.verified){
       let eToken = await Token.findOne({userId : existingUser._id});
       if(!eToken){
        eToken = await Token.create({userId:existingUser._id,token:crypto.randomBytes(32).toString("hex")});
        const url = `${process.env.BASE_URL}user/${existingUser._id}/verify/${eToken.token}`;
        await sendEmail(existingUser.email,"MUSIXON!! Verify Your Email",url);
       }
       return res.status(400).json({message:"Verify Your Email First."});
      }
      const token = jwt.sign({email:existingUser.email,id:existingUser._id},process.env.SECRET_KEY,{expiresIn:"7d"});
      res.cookie("jwtoken",token,{expires : new Date(Date.now()+604800000),httpOnly: false});
      res.status(200).json({result: existingUser,token});
    }
  } catch (error) {
    res.status(500).json({message : "Internal Server Error! Try Again!!"});
  }
}

export const resetPasswordLink = async(req,res)=>{
  const {email} = req.body;
  try {
    const existingUser = await User.findOne({email});
    if(!existingUser) return res.status(400).json({message:"User doesn't exist."});
    const eToken = await Token.create({userId:existingUser._id,token:crypto.randomBytes(32).toString("hex")});
    const url = `${process.env.BASE_URL}user/${existingUser._id}/reset/${eToken.token}`;
    await sendEmail(existingUser.email,"MUSIXON!! click here to reset your password",url);
    res.status(200).json({message:"Reset link has been sent to your email."})
  } catch (error) {
    res.status(500).json({message: "Internal Server Error! Try Again!!"})
  }
}

export const forgotPassword = async (req,res) =>{
  const {id,etoken,password,confirmpassword} = req.body;
  try {
    const existingUser = await User.findOne({_id:id});
    if(!existingUser) return res.status(400).json({message:"Invalid Link! Id Not Match."});
    const getToken = await Token.findOne({userId:id,token:etoken});
    if(!getToken) return res.status(400).json({message:"Invalid Link! Token Not Match."});
    if(password!==confirmpassword) return res.status(400).json({message:"Password doesn't match"});
    const hashedPassword = await bcrypt.hash(password,12);
    await User.updateOne({_id:id},{$set:{password:hashedPassword}});
    await Token.deleteOne({userId:id});
    res.status(200).json({message:"Password Changed Successfully."});
  } catch (error) {
    res.status(500).json({message: "Internal Server Error! Try Again!!"});
  }
}

export const editUserProfile = async(req,res)=>{
  const {name,dob,gender,country} = req.body;
  try {
    const id = req.userId;
    if(name) await User.updateOne({_id:id},{$set:{name:name}});
    if(dob) await User.updateOne({_id:id},{$set:{dob:dob}});
    if(gender) await User.updateOne({_id:id},{$set:{gender:gender}});
    if(country) await User.updateOne({_id:id},{$set:{country:country}});
    const result = await User.findOne({_id:id});
    res.status(201).json({result,message:"Your data saved successfully"});
  } catch (error) {
    res.status(500).json({message: "Internal Server Error! Try Again!!"});
  }
}

export const changeUserPassword = async(req,res) => {
  const {currentpassword,password,confirmpassword} = req.body;
  try {
    const id = req.userId;
    const existingUser = await User.findOne({_id : id});
    const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
    if(isPasswordCorrect) return res.status(404).json({message : "New password must be different from current password"});
    if(password!==confirmpassword) return res.status(404).json({message : "Password does not match."});
    const hashedPassword = await bcrypt.hash(password,12);
    await User.updateOne({_id:id},{$set : {password:hashedPassword}});
    res.status(201).json({message:"Password changed successfully."});
  } catch (error) {
    res.status(500).json({message: "Internal Server Error! Try Again!!"});
  }
}

export const deleteUserAccount = async(req,res)=>{
  try {
    const id = req.userId;
    await User.deleteOne({_id : id});
    await likedSong.deleteOne({userId : id});
    await userPlayList.deleteOne({userId : id});
    await recentlyPlayed.deleteOne({userId : id});
    res.status(200).json({message : "Account deleted successfully."});
  } catch (error) {
    res.status(500).json({message: "Internal Server Error! Try Again!!"});
  }
}