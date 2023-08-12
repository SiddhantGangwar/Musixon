import React,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as api from "../api/index.js";
import { setUserData } from '../redux/index.js';

function EditProfile() {
  const dispatch = useDispatch();
  const name = useSelector(state => state.user.userName);
  const email = useSelector(state => state.user.userEmail);
  const dob = useSelector(state => state.user.userDob);
  const region = useSelector(state => state.user.userRegion);
  const [profileData,setProfileData] = useState({
    name : "",
    dob : "",
    gender : "",
    country : ""
  });
  const [backendMessage,setBackendMessage] = useState("");

  useEffect(()=>{
    const interval = setInterval(()=>{
      if(backendMessage) setBackendMessage("");
    },3000)
    return ()=> clearInterval(interval);
  },[backendMessage]);

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setProfileData((preValue)=>{
      return{
        ...preValue,
        [name] : value
      }
    });
  }

  const handleSubmit = async()=>{
    try {
      const {data} = await api.editUserProfile(profileData);
      console.log(data);
      dispatch(setUserData(data.result));
      setBackendMessage(data.message);
    } catch (error) {
      //console.log(error);
      setBackendMessage(error.message);
    }
  }

  return (
    <div className="form-container">
      <h2>Edit Profile</h2>
      <div className="input-detail">
       <h3>Name</h3>
       <input type="text" name="name" id="inp-hx-wd" placeholder={name} onChange={handleChange}/>
      </div>
      <div className="input-detail">
       <h3>Email</h3>
       <input type="email" name="email" id="inp-hx-wd" placeholder={email} disabled/>
      </div>
      <div className="input-detail">
        <h3>Date of birth</h3>
      <input type="date" name="dob" id="inp-hx-wd" placeholder={dob} onChange={handleChange}/>
      </div>
      <div className="input-detail">
        <h3>Gender</h3>
      <select name="gender" id="inp-hx-wd" onChange={handleChange}>
        <option name="default">Choose an option</option>
        <option name="male">Male</option>
        <option name="female">Female</option>
        <option name="other">Other</option>
        <option name="notsay">Prefer not to say</option>
      </select>
      </div>
      <div className="input-detail">
        <h3>Country/Region</h3>
      <input type="text" name="country" id="inp-hx-wd" placeholder={region ? region : null} onChange={handleChange}/>
      </div>
      <div className="submit-btn">
        <button onClick={handleSubmit}>Save Profile</button>
      </div>
      {backendMessage ? <p id="back-msg">{backendMessage}</p> : null}
    </div>
  );
}

export default EditProfile; 