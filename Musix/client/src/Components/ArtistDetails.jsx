import React,{useState,useEffect} from 'react';
import { useParams } from "react-router-dom";
import "../Styles_sheet/Artists.css";
import { GoVerified } from "react-icons/go";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import {BsThreeDotsVertical} from "react-icons/bs";
import {GoPlay} from "react-icons/go";
import {useGetArtistDetailsQuery} from "../redux/services/ShazamCore";
import Loader from "../assets/Loader";
import Error from "../assets/Error";
import { useDispatch } from 'react-redux';
import { playSongs } from '../redux';
import * as api from "../api/index.js";
import * as LikedSong from "../api/songs.js";
import { Link } from 'react-router-dom';

function ArtistDetails() {
  const dispatch = useDispatch();
  const [likedSong,setLikedSong] = useState([]);
  const [songs,setSongs] = useState([]);
  const getLikedSong = async()=>{
    try {
      const {data} = await api.getLikedSong();
      setLikedSong([...data.data]);
    } catch (error) {
      //alert(error.message);
    }
  }
  useEffect(()=>{
    getLikedSong();
  },[]);
  const {id : artistId} = useParams();
  const {data, isFetching , error} = useGetArtistDetailsQuery(artistId);
  if(isFetching) return <Loader title="Loading Artist Details"/>
  if(error) return <Error />
  var artistData,artistDetail;
  if(data){
    artistData = Object.values(data?.songs);
    var arr = Object.values(data?.artists);
    artistDetail = arr[0];
  }

  const calculateTime = (sec) =>{
    const minutes = Math.floor(sec/60);
    const fminutes = minutes<10 ? `0${minutes}`:minutes;
    const seconds = Math.floor(sec%60);
    const fseconds = seconds<10 ? `0${seconds}`:seconds;
    const ftime = `${fminutes}:${fseconds}`;
    return ftime;
  }

  const handleSong = (i) =>{
    let arr = [];
    artistData.forEach((song)=>{
      let obj = {
        songId : song?.id,
        singerName : song?.attributes?.artistName,
        songName : song?.attributes?.name,
        songSrc : song?.attributes?.previews[0]?.url,
        songImgSrc : song?.attributes?.artwork?.url
      }
      arr.push(obj);
    })
    dispatch(playSongs(arr,i));
  }

  const handleLikedClick = async(song,idx) =>{
    const val = await LikedSong.handleArtistSongs(song);
    let array = songs;
    artistData.forEach((ele,index)=>{
      if(index===idx){
        if(val) array[index]=true;
        else{
          likedSong.forEach((ele,index)=>{
            if(ele.songId===song.id) likedSong.splice(index,1);
          })
          setLikedSong([...likedSong]);
          array[index]=false;
        }
      }
    })
    setSongs([...array]);
  }

  const checkInLikedSong = (obj) =>{
    if(!obj.id) return false;
    let check = false;
    likedSong.forEach((ele)=>{
      if(ele.songId===obj.id){
        check = true;
      }
    })
    return check;
  }

  return (
    <div className="artist-container">
      <div className="top-section">
        <img src={artistDetail?.attributes?.artwork?.url ? artistDetail?.attributes?.artwork?.url : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c2luZ2VyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"} alt="pic" />
        <div className="content">
          <div className="top-content">
            <i>
              <GoVerified />
            </i>
            <p>Verified Artist</p>
          </div>
          <h2>{artistDetail?.attributes?.name}</h2>
        </div>
        <div className="btm-effect"></div>
      </div>
      <div className="musicList">
        <h2 className="title">
          Popular
          <i id="play-all-margin" onClick={()=>handleSong(0)}><GoPlay /></i>
        </h2>
        <div className="song-container">
          {artistData &&
            artistData.map((obj, index) => (
              <div className="songs" key={index}>
                <div className="count">{index + 1}</div>
                <div className="song">
                  <div className="img">
                    <img src={obj?.attributes?.artwork?.url? obj?.attributes?.artwork?.url : null} alt="pic" />
                  </div>

                  <div className="content-section">
                    <p className="songName" onClick={()=>handleSong(index)}>
                      {obj?.attributes?.name? obj?.attributes?.name : "songName"}
                      <span className="singerName">{obj?.attributes?.artistName? obj?.attributes?.artistName:"singerName"}</span>
                    </p>
                    <div
                      className="loved"
                    >
                        { obj?.attributes?.durationInMillis ? <p id="duration">{calculateTime((obj?.attributes?.durationInMillis)/1000)}</p> : null}
                        { (checkInLikedSong(obj) || songs[index]) ? <i id="fill-heart"  onClick={()=>handleLikedClick(obj,index)}><FaHeart /></i>:<i id="fill-heart"  onClick={()=>handleLikedClick(obj,index)}> <FiHeart /></i>}
                        <Link to={`/songs/${obj.id}`} style={{"color":"white"}}><i id="three-x-dot"><BsThreeDotsVertical /></i></Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ArtistDetails