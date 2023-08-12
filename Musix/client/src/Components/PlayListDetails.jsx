import React,{useState,useEffect,useCallback} from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { GoPlay } from 'react-icons/go';
import {MdDelete} from "react-icons/md";
import {BsThreeDotsVertical} from "react-icons/bs";
import "../Styles_sheet/LikedSong.css";
import "../Styles_sheet/Artists.css";
import { useParams } from 'react-router-dom';
import * as api from "../api/index.js";
import { useDispatch } from 'react-redux';
import { playSongs } from '../redux';
import { Link } from 'react-router-dom';

function PlayListDetails() {
  const dispatch = useDispatch();
  const [songs, setSongs] = useState([]);
  const [url,setUrl] = useState();
  const [likedSong,setLikedSong] = useState([]);
  const [checkLiked,setCheckLiked] = useState([]);
  const params = useParams();
  // eslint-disable-next-line
  //here we have to use useCallback because it have dependency on the params.id
  const getPlayListSongs = useCallback(async()=>{
    try {
      const id = {playListId:params.id};
      // eslint-disable-next-line
      const {data} = await api.getPlayListById(id);
      setSongs([...data.data]);
      let newIndex = Math.floor(Math.random()*data.data.length);
      if(newIndex>=data.data.length) newIndex = data.data.length-1;
      setUrl(data.data[newIndex].songImgSrc);
    } catch (error) {
      // console.log(error);
      //alert(error.message);
    }
  },[params.id])

  const getLikedSong = async()=>{
    try {
      // eslint-disable-next-line
      const {data} = await api.getLikedSong();
      //console.log(data);
      setLikedSong([...data.data]);
    } catch (error) {
      //console.log(error);
      //alert(error.message);
    }
  }
  useEffect(()=>{
    getPlayListSongs();
    getLikedSong();
  },[getPlayListSongs])
  //Ading active classes
  useEffect(() => {
    const allPara = document
      .querySelector(".liked-song-container .artist-container .song-container")
      .querySelectorAll(".songName");

    function changeActive() {
      allPara.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
    }

    allPara.forEach((i) => i.addEventListener("click", changeActive));
  }, []);
 
  const checkInLikedSong = (obj) =>{
    let check = false;
    likedSong.forEach((ele)=>{
      if(ele.songId===obj.songId) check = true;
    })
    return check;
  }
 
  const handleClick = async(obj,idx) =>{
    const songData = {songId : obj.songId};
    try {
      const {data} = await api.checkLiked(songData);
      if(data.message){
        // eslint-disable-next-line
        const {data} = await api.removeLiked(songData);
        // console.log(data);
        //await getLikedSong();
        likedSong.forEach((ele,index)=>{
          if(ele.songId===obj.songId) likedSong.splice(index,1);
        })
        setLikedSong([...likedSong]);
        checkLiked[idx]=false;
      }else{
        // eslint-disable-next-line
        const {data} = await api.addliked(obj);
        //console.log(data);
        checkLiked[idx]=true;
      }
      setCheckLiked([...checkLiked]);
    } catch (error) {
      //console.log(error);
      //alert(error.message);
    }
  }

  const handleRemoveSong = async(songId) =>{
    const songData = {
      playListId : params.id,
      songId : songId
    }
    try {
      const {data} =  await api.removeSongFromPlayList(songData);
      if(data.status){
        songs.forEach((ele,index)=>{
          if(ele.songId===songId) songs.splice(index,1);
        })
        setSongs([...songs]);
      }
    } catch (error) {
      //console.log(error);
    }
  }

  const handleSongList = (index) =>{
    dispatch(playSongs(songs,index));
  }

  return (
    <div className="liked-song-container">
      <div className="top-lk-sec">
        <div className="img-lk-sec">
        <img src={url ? url : "https://images.unsplash.com/photo-1673056922655-f9e3dcb27147?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGxheWxpc3QlMjBjb3ZlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=2000&q=60"} alt="pic" />
        </div>
         <div className="content-lk-sec">
           <h3>{params.name}</h3>
           <p id="lk-playlist">PLAYLIST</p>
           <p id="lk-song-count">{songs.length} songs</p>
         </div>
         <div className="btmEffect"></div>
      </div>
      <div className="artist-container" style={{"width":"100%"}}>
       <div className="musicList">
         <div className="title-lk">
           <p># Title</p>
           <p>Singer</p>
           <i onClick={()=>handleSongList(0)}><GoPlay /></i>
         </div>
         <div className="song-container inc-song-cont-hgt">
            {songs && songs.map((obj,idx)=>(
                <div className="songs" key={idx}>
                <div className="count">{idx+1}</div>
                <div className="song">
                    <div className="img">
                        <img src={obj.songImgSrc} alt="pic" />
                    </div>
                     
                    <div className="content-section">
                        <p className="songName" onClick={() => handleSongList(idx)} >
                            {obj.songName}
                            <span className="singerName">{obj.singerName}</span>
                        </p>

                    <div className="loved">
                      { (checkInLikedSong(obj) || checkLiked[idx]) ? <i id="fill-heart" onClick={()=>handleClick(obj,idx)}><FaHeart /></i>:<i id="fill-heart" onClick={()=>handleClick(obj,idx)}> <FiHeart /></i>}
                      <i id="rmv-frx-plx" onClick={()=>handleRemoveSong(obj.songId)}><MdDelete /></i>
                      <Link to={`/songs/${obj.songId}`} style={{"color":"white"}}><i id="three-x-dot"><BsThreeDotsVertical /></i></Link>
                    </div>
                    </div>
                </div>
            </div>
            ))}
         </div>
       </div>
    </div>
    </div>
  )
}

export default PlayListDetails;