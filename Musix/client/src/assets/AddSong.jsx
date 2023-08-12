import {CgPlayListAdd} from "react-icons/cg";
import {GiLoveSong} from "react-icons/gi";
import { FiHeart } from "react-icons/fi";

const addSong = [
    {
        id:1,
        icon : <CgPlayListAdd />,
        name : "Add To Queue"
    },
    {
        id:2,
        icon : <GiLoveSong />,
        name : "Add To PlayList"
    },
    {
        id:3,
        icon : <FiHeart />,
        name : "Add To Liked Song"
    }
]

export default addSong;