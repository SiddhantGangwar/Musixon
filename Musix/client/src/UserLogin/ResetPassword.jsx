import React,{useState,useEffect} from 'react';
import "../Styles_sheet/Login.css";
import { Link } from 'react-router-dom';
import {AiOutlineClose} from "react-icons/ai";
import * as api from "../api/index.js";
import { useParams } from 'react-router-dom';

function ResetPassword() {
    const params = useParams();
    const[passwordError,setPasswordError] = useState("");
    const[errormessage,setErrormessage] = useState("");
    const[isPasswordChanged,setIsPasswordChanged] = useState(false);
    const [resetPasswordData, setResetPasswordData] = useState({
        password:"",
        confirmpassword:""
      });
    
    useEffect(()=>{
      const interval = setInterval(()=>{
        if(errormessage) setErrormessage("");
      },3000);
      return ()=> clearInterval(interval);
    },[errormessage]);

    function handleChange(e) {
      const { name, value } = e.target;
      setResetPasswordData((preValue) => {
          return {
            ...preValue,
            [name]: value,
          };
        });
    }
   
    const handleSubmit = async(e) => {
        e.preventDefault();
        var regularExpression  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/;
        var pass = resetPasswordData.password;
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
          const sendResetData = {
            id: params.id,
            etoken: params.token,
            password:resetPasswordData.password,
            confirmpassword:resetPasswordData.confirmpassword
          }
          const {data} = await api.resetpassword(sendResetData);
          setErrormessage(data?.message);
          setIsPasswordChanged(true);
          //console.log(data);
        } catch (error) {
          setErrormessage(error?.response?.data?.message);
          //console.log(error);
        }
    };

  return (
    <form className="overLay" onSubmit={handleSubmit}>
      { errormessage ?
       <div className="error-msg" style={{"width":"335px"}}>
       <p>{errormessage} {isPasswordChanged? <Link to={`/login`} style={{"textDecoration":"none","color":"red"}}>Login</Link> : <i style={{"fontSize":"24px","marginTop":"8px"}} onClick={()=>setErrormessage("")} ><AiOutlineClose /></i>}</p>
       </div> : null
      }
      <div className="lg-container rg-container">
        <div className="top-lg">
          <img
            src="https://w0.peakpx.com/wallpaper/451/187/HD-wallpaper-billie-eilish-billie-eilish-thumbnail.jpg"
            alt="img"
            className="avatar-img"
          />
        </div>
        <h2 className="h2-top">Get Started</h2>
        <div className="lg">
          <h2 className="h2-lg">New Password</h2>
          <input
            className="input-margin"
            type="password"
            name="password"
            placeholder="Enter New Password"
            onChange={handleChange}
          />
          {passwordError.length!==0 ? <p style={{"color":"red","fontSize":"12px"}}>{passwordError}</p>:null}
        </div>
        <div className="lg">
          <h2 className="h2-lg">Confirm Password</h2>
          <input
            className="input-margin"
            type="password"
            name="confirmpassword"
            placeholder="Confirm New Password"
            onChange={handleChange}
          />
        </div>
        <div className="lg">
          <input type="submit" value="Submit" className="lg-sub" />
        </div>
      </div>
    </form>
  )
}
export default ResetPassword;