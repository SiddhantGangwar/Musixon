import express from "express";
import {login,signup,verificationLink,googleLogin,resetPasswordLink,forgotPassword,editUserProfile,changeUserPassword,deleteUserAccount} from "../controllers/user.js";
import { verifyUser,auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/verifyEmail",verificationLink); 
router.post("/googlelogin",googleLogin);
router.post("/resetlink",resetPasswordLink);
router.post("/resetpassword",forgotPassword);
router.post("/verifyuser",verifyUser);
router.post("/editprofile",auth,editUserProfile);
router.post("/changepassword",auth,changeUserPassword);
router.get("/deleteaccount",auth,deleteUserAccount);

export default router;