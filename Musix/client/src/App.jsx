import React, { useEffect } from "react";
import "./App.css";
import Home from "./Components/Home";
import MainMenu from "./Components/MainMenu";
import Artists from "./Components/Artists";
import MediaPlayer from "./Components/MediaPlayer";
import LikedSongs from "./Components/LikedSongs";
import CreateAccount from "./UserLogin/CreateAccount";
import Search from "./Components/Search";
import ArtistDetails from "./Components/ArtistDetails";
import AroundYou from "./Components/AroundYou";
import SongDetails from "./Components/SongDetails";
import { Route, Routes } from "react-router-dom";
import Signup from "./UserLogin/Signup";
import Login from "./UserLogin/Login";
import EmailVerify from "./UserLogin/EmailVerify";
import ForgotPassword from "./UserLogin/ForgotPassword";
import ResetPassword from "./UserLogin/ResetPassword";
import PlayListDetails from "./Components/PlayListDetails";
import AccountOverview from "./Components/AccountOverview";
import Profile from "./Components/Profile";
import EditProfile from "./Components/EditProfile";
import ChangePassword from "./Components/ChangePassword";
import {gapi} from "gapi-script";
import { useCookies } from "react-cookie";
import * as api from "./api/index";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { isUserExist, playSongs , setUserData } from "./redux";

function App() {
  // eslint-disable-next-line
  //initializing the google login-signup
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: process.env.REACT_APP_GOOGLECLIENTID,
      scope:"email",
      plugin_name: "MUSIXON"
    });
  });
  const dispatch = useDispatch();
  const isPlayer = useSelector(state => state.player.isPlay);
  const isUser = useSelector(state => state.user.userExist);
  // eslint-disable-next-line
  const [cookies,setCookie,removeCookie] = useCookies(["jwtoken"]);
  const user = cookies.jwtoken;
  const verifyUser = async() =>{
    if(cookies.jwtoken){
      const verifyData = {token:cookies.jwtoken};
      const {data} = await api.verifyuser(verifyData);
      dispatch(isUserExist(true));
      dispatch(setUserData(data.result));
      if(data.result.lastPlayedSong){
        let arr = [data.result.lastPlayedSong];
        dispatch(playSongs(arr,0));
      }
    }else{
      dispatch(isUserExist(false));
    }
  }
  useEffect(()=>{
    verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cookies]);
  return (
    <>
      <div className={(user || isUser) ? "App" : "App1"}>
      {(user || isUser) ? <Home /> : null}
        {(user || isUser) ? (
          <Routes>
            <Route path="profile" element={<Profile />}>
              <Route index element={<AccountOverview/>}/>
              <Route path="editProfile" element={<EditProfile />}/>
              <Route path="changePassword" element={<ChangePassword />}/>
            </Route>
            <Route path="Artists"  element={<Artists />}/>
            <Route path="Home"  element={<MainMenu />}/>
            <Route path="/"  element={<MainMenu />}/>
            <Route path="LikedSongs"  element={<LikedSongs />}/>
            <Route path="Search/:searchTerm"  element={<Search />}/>
            <Route path="Home/:name/:id"  element={<PlayListDetails />}/>
            <Route path="Artists/:id"  element={<ArtistDetails />}/>
            <Route path="Home/AroundYou"  element={<AroundYou />}/>
            <Route path="songs/:songid"  element={<SongDetails />}/>
          </Routes>
        ) : (
          <Routes>
            <Route path="/"  element = {<CreateAccount />}/>
            <Route path="signup"  element={<Signup />}/>
            <Route path="user/:id/verify/:token"  element={<EmailVerify />}/>
            <Route path="login"  element={<Login />}/>
            <Route path="forgotpassword"  element={<ForgotPassword />}/>
            <Route path="user/:id/reset/:token"  element={<ResetPassword />}/>
          </Routes>
        )}
      </div>
      {isPlayer ? ( <MediaPlayer />) : null}
      <div className="appBack"></div>
    </>
  );
}

export default App;