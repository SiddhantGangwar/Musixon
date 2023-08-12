import React, { useState,useEffect } from "react";
import GoogleLogin from "react-google-login";
import { AiOutlineClose } from "react-icons/ai";
import "../Styles_sheet/Login.css";
import { Link } from "react-router-dom";
import * as api from "../api/index.js";
import validator from "validator";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isUserExist,playSongs, setUserData } from "../redux";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const[validEmail,setValidEmail] = useState(true);
  const[passwordError,setPasswordError] = useState("");
  const[errormessage,setErrormessage] = useState("");

  useEffect(()=>{
    const interval = setInterval(()=>{
      if(errormessage) setErrormessage("");
    },3000);
    return ()=> clearInterval(interval);
  },[errormessage]);

  function handleChange(e) {
    const { name, value } = e.target;
    setRegisterData((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
    if(!validator.isEmail(registerData.email)){
      setValidEmail(false);
    }else{
      setValidEmail(true);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    //lookahed below is for
    // (?=.*[0-9]) - Assert a string has at least one number;
    // (?=.*[!@#$%^&*]) - Assert a string has at least one special character.
    var regularExpression  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/;
    var pass = registerData.password;
    if(pass.length<8 || pass.length>12){
      setPasswordError("password length should be in 8-12");
      return;
    }
    if(!regularExpression.test(pass)){
      setPasswordError("password should contain one number and one special character");
      return;
    }
    setPasswordError("");
    try {
      const {data} = await api.signup(registerData);
      //console.log(data);
      setErrormessage(data?.message? data.message : "");
    } catch (error) {
      setErrormessage(error?.response?.data?.message);
      //console.log(error);
    }
  };

  
  const googleSuccess = async (res) =>{
    console.log(res);
    const googleToken = {
      tokenId : res?.tokenId
    };
    try {
      //send data to backend
      // eslint-disable-next-line
      const {data} = await api.googlelogin(googleToken);
      //console.log(data);
      dispatch(isUserExist(true));
      dispatch(setUserData(data.result));
      if(data.result.lastPlayedSong){
        let arr = [data.result.lastPlayedSong];
        dispatch(playSongs(arr,0));
      }
      navigate(`/`);
    }catch(error){
      //console.log(error);
      setErrormessage(error);
    }
  }

  const googleFailure = (error) =>{
    setErrormessage(error.message);
  }

  return(
    <form className="overLay" onSubmit={handleSubmit}>
    { errormessage ?
     <div className="error-msg">
      <p>{errormessage} <i style={{"fontSize":"24px","marginTop":"8px"}} onClick={()=>setErrormessage("")} ><AiOutlineClose /></i></p>
     </div> : null
    }
     <div className="lg-container sg-container">
        <div className="top-lg">
          <img
            src="https://w0.peakpx.com/wallpaper/451/187/HD-wallpaper-billie-eilish-billie-eilish-thumbnail.jpg"
            alt="img"
            className="avatar-img sgavatar-img"
          />
          <Link to={`/`}><i className="sg-tp-icon"><AiOutlineClose /></i></Link>
        </div>
        <h2>Get Started</h2>
        <div className="lg sg">
          <h2>Name</h2>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            onChange={handleChange}
          />
        </div>
        <div className="lg sg">
          <h2>Email</h2>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />
          {!validEmail? <p style={{"color":"red","fontSize":"12px"}}>*enter the valid email</p>:null}
        </div>
        <div className="lg sg">
          <h2>Password</h2>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />
          {passwordError.length!==0 ? <p style={{"color":"red","fontSize":"12px"}}>{passwordError}</p>:null}
        </div>
        <div className="lg sg">
          <h2>Confirm Password</h2>
          <input
            type="password"
            name="confirmpassword"
            placeholder="Re-Enter Password"
            onChange={handleChange}
          />
        </div>
        <div className="lg">
          <input type="submit" value="SignUp" onClick={handleSubmit}/>
        </div>
        <div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLECLIENTID}
            theme="dark"
            className="google-login"
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
        </div>
        <div className="gotologin">
        <p style={{"color":"#fff","marginTop":"7px"}}>Already have an account? <Link to={`/login`}>Login</Link></p>
        </div>
      </div>
    </form>
  );
}

export default Signup;