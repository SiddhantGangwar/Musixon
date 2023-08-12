import express from "express";
import {auth} from "../middleware/auth.js";
import { addLiked,removeLiked,checkLiked,getLikedSong,createPlayList,deletePlayList,updatePlayList,getPlayList,getPlayListById,removeSongFromPlayList,addToRecentlyPlayedSongs,getRecentlyPlayedSongs } from "../controllers/songs.js";

const router = express.Router();

router.post("/addlikedsong",auth,addLiked);
router.post("/removelikedsong",auth,removeLiked);
router.post("/checkliked",auth,checkLiked);
router.get("/getlikedsong",auth,getLikedSong);
router.post("/createplaylist",auth,createPlayList);
router.post("/deleteplaylist",auth,deletePlayList);
router.post("/updateplaylist",auth,updatePlayList);
router.get("/getplaylist",auth,getPlayList);
router.post("/getplaylistbyid",auth,getPlayListById);
router.post("/removesongfromplaylist",auth,removeSongFromPlayList);
router.post("/addtorecentlyplayed",auth,addToRecentlyPlayedSongs);
router.get("/getrecentlyplayed",auth,getRecentlyPlayedSongs);

export default router;