import React from "react";
import "../Styles_sheet/Profile.css";
import profileList from "../assets/ProfileList";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUserData, clearUserMedia, isUserExist } from "../redux";
import { Link,Outlet } from "react-router-dom";
import * as api from "../api/index.js";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const [cookies,setCookie,removeCookie] = useCookies(["jwtoken"]);

  const handleClick = async(id) =>{
    if(id===4){
      //logout
      dispatch(isUserExist(false));
      dispatch(clearUserData());
      dispatch(clearUserMedia());
      removeCookie("jwtoken",{path : `/`});
      navigate(`/`);
    }else if(id===5){
      //delete account
      try {
        const {data} = await api.deleteUserAccount();
        console.log(data);
        dispatch(isUserExist(false));
        dispatch(clearUserData());
        dispatch(clearUserMedia());
        removeCookie("jwtoken",{path : `/`});
        navigate(`/`);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="profileContainer">
        <div className="lfx-sd-con">
            <div className="profile-avatar">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoYKMCx6t9-CHWuU3Ox8tt-MMcLoajIflI2irU9xBWjbVHQkL8jHU67SjB7PXpYMhm93U&usqp=CAU" alt="pic" />
            </div>
           {
             profileList && profileList.map((obj)=>(
                <div className="account-route" key={obj.id}>
                    <i>{obj.icon}</i>
                    { obj.route ? <Link to={`${obj.route}`} id="accx">{obj.name}</Link> : <p id="accx" onClick={()=>handleClick(obj.id)}>{obj.name}</p>}
                </div>
             ))
           }
        </div>
        <div className="rhx-sd-con">
          <Outlet />
        </div>
    </div>
  );
}

export default Profile;