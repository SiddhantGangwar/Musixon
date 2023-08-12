import React,{useState,useEffect} from 'react';
import * as api from "../api/index.js";
import { useDispatch } from 'react-redux';
import { playSongs } from '../redux/index.js';

function Recently({songArray}){
  
  const [songs,setSongs] = useState([]);
  const dispatch = useDispatch();
  useEffect(()=>{
    const getRecentPlayed = async()=>{
      try {
        const {data} = await api.getRecentlyPlayedSongs();
        setSongs([...data.data]);
      } catch (error) {
        // console.log(error);
        //alert(error.message);
      }
    }
    getRecentPlayed();
  },[])
  function handleSong(obj){
    let arr = [];
    arr.push(obj);
    dispatch(playSongs(arr,0));
  }

  return (
    <>
    <h2 id="recent">Recently Played</h2>
    <div className="songs-row">
    <div className="songs-card recent-song-card">
           {
            songs && songs.map((obj,idx)=>(
               <div className="songs" key={idx} onClick={()=>handleSong(obj)}>
               <img src={obj.songImgSrc} alt="pic" />
               <h3 id="name">{obj.songName}</h3>
               <h3 id="singer">{obj.singerName}</h3>
               </div>
            ))
           }
    </div>
    </div>
    </>
  );
}

export default Recently;