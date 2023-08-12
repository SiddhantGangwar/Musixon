import React from "react";
import { useEffect,useState } from "react";
import { Link,useParams } from "react-router-dom";
import "../Styles_sheet/Login.css";
import * as api from "../api/index.js";

const EmailVerify = () =>{
    const params = useParams();
    const[validUrl,setValidUrl] = useState(false);
    const [showErrorPage,setShowErrorPage] = useState(false);
    useEffect(()=>{
        const verifyEmailUrl = async() =>{
            try {
              const sendData = {
                id:params.id,
                etoken:params.token
              }
              // eslint-disable-next-line
              const {data} = await api.verifylink(sendData);
              setValidUrl(true);
              //console.log(data);
            } catch (error) {
              //console.log(error);
              setValidUrl(false);
              setShowErrorPage(true);
            }
        }
        verifyEmailUrl();
    },[params])
    return(
      <>
       {
        validUrl ? 
        <div className="overLay" style={{"background":"#fff"}}>
          <div className="lg-container eg-container">
             <div className="top-eg">
               <img src="https://cdn-icons-png.flaticon.com/512/214/214707.png" alt="pic" />
             </div>
             <div className="eg-con">
               <h2>Your Email Verified Successfully!!</h2>
               <p>Click here to login <Link to={`/login`}>Login</Link> </p>
             </div>
          </div>
        </div> : 
        <div style={{"background":"#fff","width":"100%"}}> { showErrorPage? <h2>404 Something Went Wrong!! Please Try Again.</h2> : null}</div>
       }
      </>
    );
}

export default EmailVerify;