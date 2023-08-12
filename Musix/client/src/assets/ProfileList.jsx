import React from "react";
import {AiFillHome} from "react-icons/ai";
import {MdModeEditOutline} from "react-icons/md";
import {AiTwotoneUnlock} from "react-icons/ai";
import {AiFillDelete} from "react-icons/ai";
import {BiLogOut} from "react-icons/bi";

const ProfileList = [
    {
        id : 1,
        icon : <AiFillHome />,
        name : "Account overview",
        route : "/profile"
    },
    {
        id:2,
        icon : <MdModeEditOutline />,
        name : "Edit profile",
        route : "editProfile"
    },
    {
        id : 3,
        icon : <AiTwotoneUnlock />,
        name : "Change password",
        route : "changePassword"
    },
    {
        id : 4,
        icon : <BiLogOut />,
        name : "Logout",
    },
    {
        id : 5,
        icon : <AiFillDelete />,
        name : "Delete account",
    }
]

export default ProfileList;