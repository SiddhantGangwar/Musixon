import axios from "axios";

const API = axios.create({baseURL: "http://localhost:5000"});

export const signup = (registerData) => API.post('/user/signup',registerData,{withCredentials:true});
export const login = (loginData) => API.post('/user/login',loginData,{withCredentials:true});
export const verifylink = (sendData) => API.post('/user/verifyEmail',sendData,{withCredentials:true});
export const googlelogin = (googleToken) => API.post('/user/googlelogin',googleToken,{withCredentials:true});
export const forgotpassword = (forgetPasswordData) => API.post("/user/resetlink",forgetPasswordData,{withCredentials:true});
export const resetpassword = (sendResetData) => API.post("/user/resetpassword",sendResetData,{withCredentials:true});
export const verifyuser = (verifyData) => API.post("/user/verifyuser",verifyData,{withCredentials:true});
export const addliked = (songData) => API.post("/song/addlikedsong",songData,{withCredentials:true});
export const removeLiked = (songData) => API.post("/song/removelikedsong",songData,{withCredentials:true});
export const checkLiked = (songData) => API.post("/song/checkliked",songData,{withCredentials:true});
export const getLikedSong = () => API.get("/song/getlikedsong",{withCredentials:true});
export const createPlayList = (playListData) => API.post("/song/createplaylist",playListData,{withCredentials:true});
export const deletePlayList = (playListData) => API.post("/song/deleteplaylist",playListData,{withCredentials:true});
export const updatePlayList = (playListData) => API.post("/song/updateplaylist",playListData,{withCredentials:true});
export const getPlayList = () => API.get("/song/getplaylist",{withCredentials:true});
export const getPlayListById = (id) => API.post("/song/getplaylistbyid",id,{withCredentials:true});
export const removeSongFromPlayList = (songData) => API.post("/song/removesongfromplaylist",songData,{withCredentials:true});
export const addToRecentlyPlayedSongs = (songData) => API.post("/song/addtorecentlyplayed",songData,{withCredentials:true});
export const getRecentlyPlayedSongs = () => API.get("/song/getrecentlyplayed",{withCredentials:true});
export const editUserProfile = (profileData) => API.post("/user/editprofile",profileData,{withCredentials:true});
export const changeUserPassword = (changePassData) => API.post("/user/changepassword",changePassData,{withCredentials:true});
export const deleteUserAccount = () => API.get("/user/deleteaccount",{withCredentials:true});