import React,{useState,useRef,useEffect} from 'react';
import {BiShuffle} from "react-icons/bi";
import {AiFillLeftCircle} from "react-icons/ai";
import {AiFillRightCircle} from "react-icons/ai";
import {FaPlayCircle} from "react-icons/fa";
import {FaPauseCircle} from "react-icons/fa";
import {BiRepeat} from "react-icons/bi";
import {GoMute} from "react-icons/go";
import {GiSpeaker} from "react-icons/gi";
import {MdRepeatOne} from "react-icons/md";
import {FaHeart} from "react-icons/fa";
import {FiHeart} from "react-icons/fi";
import "../Styles_sheet/MediaPlayer.css";
import * as api from "../api/index.js";
import * as LikedSong from "../api/songs.js";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { isMediaLiked, removeQueue } from '../redux';

function MediaPlayer(){

  const dispatch = useDispatch();

  const songs = useSelector(state => state.player.songs);
  const queue = useSelector(state => state.player.queueSongs);
  const ind = useSelector(state => state.player.index);
  const isSongAction = useSelector(state => state.player.isSongPlay);
  const checkLiked = useSelector(state => state.player.isSongLiked);

  const[index,setIndex] = useState(ind);
  const[currSong,setCurrSong] = useState(songs[ind]);
  const[isPlay,setIsPlay] = useState(false);
  const[isMute,setIsMute] = useState(false);
  const[isRepeat,setIsRepeat] = useState(false);
  const[duration,setDuration] = useState(0);
  const[currentTime,setCurrentTime] = useState(0);
  const[volume,setVolume] = useState(30);
  const[likedSong,setLikedSong] = useState([]);

  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();
  
  useEffect(()=>{
    const getLikedSong = async()=>{
      try {
        const {data} = await api.getLikedSong();
        setLikedSong([...data.data]);
      } catch (error) {
        // console.log(error);
        //alert(error.message);
      }
    }
    getLikedSong();
  },[])

  // Songs updated every time when new array of songs came
  useEffect(()=>{
    if(queue.length>0 && !isSongAction){
      setCurrSong(queue[0]);
      dispatch(removeQueue());
    }else{
      setIndex(ind);
      setCurrSong(songs[ind]);
    }
    setIsPlay(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[songs,queue,ind,isSongAction]);

  useEffect(()=>{
    const addToRecentlyPlayed = async() =>{
      if(!currSong) return;
      if(currSong.songId===null) return;
      try {
        // eslint-disable-next-line
        const {data} = await api.addToRecentlyPlayedSongs(currSong);
        // console.log(data);
      } catch (error) {
        // console.log(error);
        //alert(error.message);
      }
    }
    addToRecentlyPlayed();
  },[currSong])

  useEffect(()=>{
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  },
  [audioPlayer?.current?.loadedmetadata,
   audioPlayer?.current?.readyState
  ]);

  //volume control functionalities
  useEffect(()=>{
    if(audioPlayer){
      audioPlayer.current.volume = volume/100;
    }
    if(volume>0){
      setIsMute(false);
    }
  },[volume])

  const handleSound = () =>{
    setIsMute(!isMute);
    if(!isMute) setVolume(0);
    if(isMute){
      setVolume(1);
    }
  }

  function handlePlayer(){
    const prevStateValue = isPlay;
    if(!prevStateValue){
        audioPlayer.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
    }else{
        audioPlayer.current.pause();
        cancelAnimationFrame(animationRef.current);
    }
    setIsPlay(!prevStateValue);
  }
 
  const calculateTime = (sec) =>{
    const minutes = Math.floor(sec/60);
    const fminutes = minutes<10 ? `0${minutes}`:minutes;
    const seconds = Math.floor(sec%60);
    const fseconds = seconds<10 ? `0${seconds}`:seconds;
    const ftime = `${fminutes}:${fseconds}`;
    return ftime;
  }
  
  const whilePlaying = () =>{
    progressBar.current.value = audioPlayer.current.currentTime;
    changeCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  }
  const changeProgress = () =>{
    audioPlayer.current.currentTime = progressBar.current.value;
    changeCurrentTime();
  }
   
  const changeCurrentTime = () =>{
    progressBar.current.style.setProperty("--player-played",`${progressBar.current.value/duration*100}%`);
    setCurrentTime(progressBar.current.value);
  }

  const handleSongEnded = () =>{
    setIsPlay(false);
  }

  //repeat current song 
  const handleRepeat = () =>{
    setIsRepeat(!isRepeat);
  }

  //next and previous buttons
  const handleNextSong = () =>{
    if(songs.length>1) setIsPlay(false);
    if(queue.length>0){
      setCurrSong(queue[0]);
      dispatch(removeQueue());
    }
    else if(index>=songs.length-1){
      setIndex(0);
      setCurrSong(songs[0]);
    }else{
      setIndex(prevCount => prevCount+1);
      setCurrSong(songs[index+1]);
    }
  }

  const handlePreviousSong = () =>{
    if(songs.length>1) setIsPlay(false);
    if(index>0){
      setIndex(prevCount => prevCount-1);
      setCurrSong(songs[index-1]);
    }else{
      setIndex(songs.length-1);
      setCurrSong(songs[songs.length-1]);
    }
  } 
  
  //Shuffle Functionality
  const handleShuffle = () =>{
    // eslint-disable-next-line
    let newIndex = Math.floor(Math.random()*songs.length);
    if(newIndex!==index) setIsPlay(false);
    // eslint-disable-next-line
    if(newIndex>=songs.length) newIndex = songs.length-1;
    setIndex(newIndex);
    setCurrSong(songs[newIndex]);
  }

  const handleFavClick = async(songData) =>{
    const val = await LikedSong.checkLikedSong(songData.songId);
    if(val){
      const rmvSongData = {
        songId : songData.songId
      }
      try {
        // eslint-disable-next-line
        const {data} = await api.removeLiked(rmvSongData);
        dispatch(isMediaLiked(false));
        likedSong.forEach((ele,index)=>{
          if(ele.songId===songData.songId) likedSong.splice(index,1);
        })
        setLikedSong([...likedSong]);
      } catch (error) {
        // console.log(error);
        //alert(error.message);
      }
    }else{
      try {
        // eslint-disable-next-line
        const {data} = await api.addliked(songData);
        dispatch(isMediaLiked(true));
      } catch (error) {
        //console.log(error);
        //alert(error.message);
      }
    }
  }

  const checkInLikedSong = (id) =>{
    let check = false;
    likedSong.forEach((ele)=>{
      if(ele.songId===id) check=true;
    })
    return check;
  }

  return (
    <div className="music-container">
      <div className="left-music-part">
        <audio loop={isRepeat} src={currSong?.songSrc} preload="metadata" ref={audioPlayer} onEnded={handleSongEnded}></audio>
           
        <img src={currSong?.songImgSrc} alt="pic" />
        <div className="content-music-lf">
          <p id="msc-con1">{currSong?.songName}</p>
          <p id="msc-con2">{currSong?.singerName}</p>
        </div>
        { checkInLikedSong(currSong?.songId) || (checkLiked)  ?  <i id="liked" onClick={()=>handleFavClick(currSong)}><FaHeart /></i> : <i id="liked" onClick={()=>handleFavClick(currSong)}><FiHeart /></i>}
      </div>
      <div className="middle-music-part">
        <div className="top-middle-msc">
           <i id="doShuffle" onClick={handleShuffle}><BiShuffle /></i>
           <i onClick={handlePreviousSong}><AiFillLeftCircle /></i>
           {isPlay ? <i id="play-msc" onClick={handlePlayer}><FaPauseCircle /></i> : 
            <i id="play-msc" onClick={handlePlayer}><FaPlayCircle /></i> }
           <i onClick={handleNextSong}><AiFillRightCircle /></i>
           {isRepeat ? <i id="repeat-now" onClick={handleRepeat}><MdRepeatOne/></i> : <i id="doShuffle"onClick={handleRepeat}><BiRepeat /></i>}
        </div>
        <div className="btm-middle-msc">
           <p className="duration">{calculateTime(currentTime)}</p>

           <input type="range" id="range" onChange={changeProgress} ref={progressBar} value={currentTime}/>

           <p className="duration">{(duration && !isNaN(duration)) ? calculateTime(duration) : "00:00"}</p>
        </div>
      </div>
      <div className="right-music-part">
        {(isMute || volume===0) ? <i onClick={handleSound}><GoMute /></i> : <i onClick={handleSound}><GiSpeaker /></i>}
        <input type="range" id="volume" min={0} max={100} value={volume}
         onChange={(e)=>setVolume(e.target.value)} 
        />
      </div>
    </div>
  );
}

export default MediaPlayer;