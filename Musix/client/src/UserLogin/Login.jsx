import React, { useState,useEffect } from "react";
import GoogleLogin from "react-google-login";
import { AiOutlineClose } from "react-icons/ai";
import "../Styles_sheet/Login.css";
import { Link , useNavigate } from "react-router-dom";
import * as api from "../api/index.js";
import { useDispatch } from "react-redux";
import { isUserExist, playSongs, setUserData } from "../redux";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const[errormessage,setErrormessage] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  useEffect(()=>{
    const interval = setInterval(()=>{
     if(errormessage) setErrormessage("");
    },3000);
    return () => clearInterval(interval);
  },[errormessage]);

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line
      const {data} = await api.login(loginData);
      dispatch(isUserExist(true));
      dispatch(setUserData(data.result));
      if(data.result.lastPlayedSong){
        let arr = [data.result.lastPlayedSong];
        dispatch(playSongs(arr,0));
      }
      navigate(`/`);
    } catch (error) {
      setErrormessage(error?.response?.data?.message);
    }
  };

  const googleSuccess = async (res) =>{
    // console.log(res);
    const googleToken = {
      tokenId : res?.tokenId
    };
    try {
      //send data to backend
      // eslint-disable-next-line
      const {data} = await api.googlelogin(googleToken);
      dispatch(isUserExist(true));
      dispatch(setUserData(data.result));
      if(data.result.lastPlayedSong){
        let arr = [data.result.lastPlayedSong];
        dispatch(playSongs(arr,0));
      }
      navigate(`/`);
    }catch(error){
      setErrormessage(error.message);
      // console.log(error);
    }
  }

  const googleFailure = (error) =>{
    //console.log(error);
    setErrormessage(error.message);
  }

  return(
    <form className="overLay" onSubmit={handleSubmit}>
      { errormessage ?
        <div className="error-msg">
        <p>{errormessage} <i style={{"fontSize":"24px","marginTop":"8px"}} onClick={()=>setErrormessage("")} ><AiOutlineClose /></i></p>
        </div> : null
      }
      <div className="lg-container">
        <div className="top-lg">
          <img
            src="https://w0.peakpx.com/wallpaper/451/187/HD-wallpaper-billie-eilish-billie-eilish-thumbnail.jpg"
            alt="img"
            className="avatar-img"
          />
          <Link to={`/`}> <i>
            <AiOutlineClose />
          </i></Link>
        </div>
        <h2 className="h2-top">Get Started</h2>
        <div className="lg">
          <h2 className="h2-lg">Email</h2>
          <input
            className="input-margin"
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />
        </div>
        <div className="lg">
          <h2 className="h2-lg">Password</h2>
          <input
            className="input-margin"
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />
        </div>
        <div className="lg">
          <input type="submit" value="Login" className="lg-sub" />
        </div>
        <div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLECLIENTID}
            theme="dark"
            buttonText="Login with Google"
            className="google-login"
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
        </div>
        <div className="btm-content">
          <p>password ?</p>
          <Link to={`/forgotpassword`}>forgotPassword</Link>
        </div>
        <div className="btm-content">
          <p>Create Account here </p>
          <Link to={`/signup`}>Signup</Link>
        </div>
      </div>
    </form>
  );
}

export default Login;