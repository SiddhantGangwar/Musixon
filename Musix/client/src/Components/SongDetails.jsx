import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Styles_sheet/SongDetails.css";
import {AiOutlineClose} from "react-icons/ai";
import Loader from "../assets/Loader";
import Error from "../assets/Error";
import { useGetSongDetailsQuery } from "../redux/services/ShazamCore";
import addSong from "../assets/AddSong";
import { FaHeart } from "react-icons/fa";
import * as LikedSong from "../api/songs.js";
import * as api from "../api/index.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { freeQueueStatus, playQueue } from "../redux/mediaPlayer/playerAction";

function SongDetails() {
  const dispatch = useDispatch();
  const queueStatus = useSelector(state => state.player.queueMsg);
  const clearQueueMsg = useSelector(state => state.player.isStatusFreed);
  // eslint-disable-next-line
  const [likedSong, setLikedSong] = useState([]);
  const [playListOption, setPlayListOption] = useState(false);
  const [allPlayList, setAllPlayList] = useState([]);
  const [liked, setLiked] = useState(false);
  const [msg,setMsg] = useState("");
  // eslint-disable-next-line
  const [selectData,setSelectData] = useState({name:""});
  const { songid } = useParams();
  const { data, isFetching, error } = useGetSongDetailsQuery(songid);
  useEffect(()=>{
    const interval = setInterval(()=>{
      if(msg) setMsg("");
      if(!clearQueueMsg) dispatch(freeQueueStatus());
    },3000)
    return ()=> clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[msg,clearQueueMsg])
  const getLikedSong = async () => {
    try {
      const { data } = await api.getLikedSong();
      if (data) {
        setLikedSong([...data.data]);
      }
    } catch (error) {
      //console.log(error);
      //alert(error.message);
    }
  };
  useEffect(() => {
    getLikedSong();
  }, []);
  const getPlayList = async () => {
    try {
      const { data } = await api.getPlayList();
      if (data) {
        let arr = [];
        data.data.forEach((ele) => {
          arr.push(ele.playListName);
        });
        setAllPlayList([...arr]);
      }
    } catch (error) {
      //console.log(error);
      //alert(error.message);
    }
  };
  useEffect(() => {
    getPlayList();
  }, []);
  if (isFetching) return <Loader title="Loading Song Details" />;
  if (error) return <Error />;
  var lyric = null;
  // eslint-disable-next-line
  data?.sections?.map((obj) => {
    if (obj.type === "LYRICS") lyric = obj.text;
  });
  const handleAddClick = async (id) => {
    if (id === 3) {
      //add or remove from liked song list
      const val = await LikedSong.handleLikedSong(data);
      if (val) setLiked(true);
      else {
        likedSong.forEach((ele,index)=>{
          if(ele.songId===data.key) likedSong.splice(index,1);
        })
        setLikedSong([...likedSong]);
        setLiked(false);
      }
    }else if(id===1){
      setMsg("");
      const songData = {
        songId : data?.key,
        singerName : data?.subtitle,
        songName : data?.title,
        songSrc : data?.hub?.actions[1]?.uri,
        songImgSrc : data?.share?.image
      };
      dispatch(playQueue(songData));
    }
  };

  const handleChange = async(e) =>{
    dispatch(freeQueueStatus());
    const {name,value} = e.target;
    setPlayListOption(false);
    setSelectData((prevValue)=>{
      return{
        ...prevValue,
        [name]:value
      }
    });
    if(value==="Choose an option") return;
    const songData = {
      playListName : value,songId : `${data?.key}`,singerName:data?.subtitle,songName:data?.title,songSrc:`${data?.hub?.actions[1]?.uri}`,songImgSrc:`${data?.share?.image}`
    }
    try {
      const {data} = await api.updatePlayList(songData);
      setMsg(data.message);
    } catch (error) {
      //console.log(error);
      setMsg(error.message);
    }
  }

  const check = () => {
    if (!data.key) return false;
    let flag = false;
    likedSong.forEach((ele) => {
      if (ele.songId === data.key) {
        flag = true;
      }
    });
    return flag;
  }; 

  const handleFlags = () => {
    dispatch(freeQueueStatus());
    setMsg("");
  }

  return (
    <div className="songDetailsContainer">
      <div className="song-det-box">
      { msg || queueStatus? 
      <div className="ds-backend-msg">
        <p>{msg ? msg : queueStatus} <i onClick={handleFlags}><AiOutlineClose /></i> </p>
      </div> : null
      }  
        <div className="img-top">
          <img
            src={data?.images?.coverart ? data?.images?.coverart : null}
            alt="pic"
          />
          <p className="songName">
            {data?.title} - {data?.subtitle}
          </p>
          <p className="songName dim">{data?.genres?.primary}</p>
        </div>
        <div className="contentSongSec">
          {addSong &&
            addSong.map((obj, idx) => (
              <div
                className="add-list"
                key={obj.id}
                onClick={() => handleAddClick(obj.id)}
              >
                {obj.id !== 2 ? (
                  <div>
                    <i className="sec-logo">
                      {(liked || check()) && obj.id === 3 ? (
                        <FaHeart style={{ color: "green" }} />
                      ) : (
                        obj.icon
                      )}
                    </i>
                    <span className="sec-head">
                      {(liked || check()) && obj.id === 3
                        ? `Remove From Liked Song`
                        : obj.name}
                    </span>
                  </div>
                ) : (
                  <div>
                    <i className="sec-logo">{obj.icon}</i>
                    <span
                      className="sec-head"
                      onClick={() => setPlayListOption((prev) => !prev)}
                    >
                      {obj.name}
                    </span>
                    {playListOption && allPlayList ? (
                      <select name="name" id="select-playlist" onChange={handleChange}>
                        <option name="name">
                          Choose an option
                        </option>
                        {allPlayList.map((ele, idx) => (
                          <option name = {ele} key={idx}>
                            {ele}
                          </option>
                        ))}
                      </select>
                    ) : !allPlayList ? (
                      alert("First create a playlist.")
                    ) : null}
                  </div>
                )}
              </div>
            ))}
        </div>
        <div className="lyrics">
          <h3
            style={{
              color: "white",
              marginLeft: "12px",
              fontSize: "18px",
              fontWeight: "400",
              fontFamily: "cursive",
              position: "relative",
              marginBottom: "-20px",
              marginTop: "2px",
            }}
          >
            {lyric ? "Lyrics" : "No Lyrics Found"}
          </h3>
          {lyric
            ? lyric.map((obj, idx) => (
                <div className="lyrics-section" key={idx}>
                  <p className="lyrics-para">{obj}</p>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default SongDetails;