import React,{useState,useEffect} from 'react';
import { FaHeart } from 'react-icons/fa';
import { GoPlay } from 'react-icons/go';
import {BsThreeDotsVertical} from "react-icons/bs";
import "../Styles_sheet/LikedSong.css";
import "../Styles_sheet/Artists.css";
import * as api from "../api/index.js";
import { useDispatch } from 'react-redux';
import { playSongs } from '../redux';
import { Link } from 'react-router-dom';

function LikedSongs() {
  // eslint-disable-next-line
  const [songs, setSongs] = useState([]);
  const dispatch = useDispatch();
  useEffect(()=>{
    const getLikedSong = async()=>{
      try {
        const {data} = await api.getLikedSong();
        if(data){
          setSongs([...data.data]);
        }
      } catch (error) {
        // console.log(error);
        //alert(error.message);
      }
    }
    getLikedSong();
  },[])

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

  const removeFavourite = async(songId) =>{
    try{
      const songData = {
        songId : songId
      };
      const {data} = await api.removeLiked(songData);
      if(data && data.status){
        const {data} = await api.getLikedSong();
        setSongs([...data.data]);
      }
    }catch (error) {
      // console.log(error);
      alert(error.message);
    }
  }
  
  const handleSongList = (index) =>{
    dispatch(playSongs(songs,index));
  }
 
  return (
    <div className="liked-song-container">
      <div className="top-lk-sec">
        <div className="img-lk-sec">
         <img src="https://images.unsplash.com/photo-1515890435782-59a5bb6ec191?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bG92ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=2000&q=60" alt="pic" />
         </div>
         <div className="content-lk-sec">
           <h3>Liked Songs</h3>
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
                        <i id="fill-heart" onClick={()=>removeFavourite(obj.songId)}><FaHeart /></i>
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

export default LikedSongs;