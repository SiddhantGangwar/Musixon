import React from "react";
import  {FcHome}  from "react-icons/fc"
import  {FcMusic}  from "react-icons/fc"
import  {FcLike}  from "react-icons/fc"
import {FcAddDatabase} from "react-icons/fc"

const NavBarList = [
    {
        id : 1,
        icon : <FcHome />,
        name : "Home",
        route : "Home"
    },
    {
        id : 2,
        icon : <FcMusic />,
        name : "Artists",
        route : "Artists"
    },
    {
        id : 3,
        icon : <FcLike />,
        name : "Liked Songs",
        route : "LikedSongs"
    },
    {
        id : 4,
        icon : <FcAddDatabase/>,
        name : "CreatePlaylist",
        route : "CreatePlaylist"
    }
]

export default NavBarList;