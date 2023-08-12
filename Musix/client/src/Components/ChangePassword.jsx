import React,{useState,useEffect} from 'react';
import * as api from "../api/index.js";

function ChangePassword() {
  const [changePassData,setChangePassData] = useState({
    currentpassword : "",
    password : "",
    confirmpassword : ""
  });
  const [backendMessage,setBackendMessage] = useState("");

  useEffect(()=>{
   const interval = setInterval(()=>{
    if(backendMessage) setBackendMessage("");
   },3000);
   return ()=> clearInterval(interval);
  },[backendMessage])

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setChangePassData((preValue)=>{
      return{
        ...preValue,
        [name] : value
      }
    });
  }

  const handleSubmit = async() =>{
    if(!changePassData.currentpassword || !changePassData.password || !changePassData.confirmpassword){
      setBackendMessage("No field should br empty.");
      return;
    }
    var regularExpression  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/;
    var pass = changePassData.password;
    if(pass.length<8 || pass.length>12){
      setBackendMessage("password length should be in 8-12");
      return;
    }
    if(!regularExpression.test(pass)){
      setBackendMessage("password should contain one number and one special character");
      return;
    }
    try {
      const {data} = await api.changeUserPassword(changePassData);
      console.log(data);
      setBackendMessage(data.message);
    } catch (error) {
      //console.log(error);
      setBackendMessage(error?.response?.data?.message);
    }
  }

  return (
    <div className="form-container">
      <h2>Change Password</h2>
      <div className="input-detail">
       <h3>Current Password</h3>
       <input type="password" name="currentpassword" id="inp-hx-wd" onChange={handleChange}/>
      </div>
      <div className="input-detail">
       <h3>New Password</h3>
       <input type="password" name="password" id="inp-hx-wd" onChange={handleChange}/>
      </div>
      <div className="input-detail">
        <h3>Confirm Password</h3>
      <input type="password" name="confirmpassword" id="inp-hx-wd" onChange={handleChange}/>
      </div>
      <div className="submit-btn">
        <button style={{"width":"150px"}} onClick={handleSubmit}>Set Password</button>
      </div>
      {backendMessage ? <p id="back-msg">{backendMessage}</p> : null}
    </div>
  )
}

export default ChangePassword;