import React,{useState,useEffect} from 'react';
import "../Styles_sheet/Login.css";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom';
import * as api from "../api/index.js";

function ForgotPassword() {
  const[errormessage,setErrormessage] = useState("");

  useEffect(()=>{
   const interval = setInterval(()=>{
     if(errormessage) setErrormessage("");
   },3000);
   return ()=> clearInterval(interval);
  },[errormessage]);

  const [forgetPasswordData, setForgetPasswordData] = useState({
    email: ""
  });
   
  function handleChange(e) {
    const { name, value } = e.target;
    setForgetPasswordData((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  }
   
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const {data} = await api.forgotpassword(forgetPasswordData);
      setErrormessage(data.message);
      //console.log(data.message);
    } catch (error) {
      setErrormessage(error.message);
      //console.log(error);
    }
  };

  return (
    <form className="overLay" onSubmit={handleSubmit}>
      { errormessage ?
       <div className="error-msg" style={{"width":"335px"}}> 
       <p>{errormessage} <i style={{"fontSize":"24px","marginTop":"8px"}} onClick={()=>setErrormessage("")} ><AiOutlineClose /></i></p>
       </div> : null
      }
      <div className="lg-container fg-container">
        <div className="top-lg">
          <img
            src="https://w0.peakpx.com/wallpaper/451/187/HD-wallpaper-billie-eilish-billie-eilish-thumbnail.jpg"
            alt="img"
            className="avatar-img"
          />
          <Link to={`/login`}> <i>
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
          <input type="submit" value="Submit" className="lg-sub" />
        </div>
      </div>
    </form>
  )
}

export default ForgotPassword;