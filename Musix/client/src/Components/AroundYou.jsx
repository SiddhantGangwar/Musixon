import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {useGetSongsByCountryQuery} from "../redux/services/ShazamCore";
import Loader from "../assets/Loader";
import Error from '../assets/Error';
import "../Styles_sheet/Artists.css";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import {BsThreeDotsVertical} from "react-icons/bs";
import {GoPlay} from "react-icons/go";
import * as api from "../api/index.js";
import * as LikedSong from "../api/songs.js";
import { useDispatch } from 'react-redux';
import { playSongs } from '../redux';
import { Link } from 'react-router-dom';

function AroundYou() {
  const dispatch = useDispatch();
  const [country,setCountry] = useState("");
  //eslint-disable-next-line
  const [likedSong,setLikedSong] = useState([]);
  //eslint-disable-next-line
  const [loading,setLoading] = useState(true);
  const [songs,setSongs] = useState([]);

  useEffect(()=>{
    //at_295tWjrAYfuR13xdY5nYQkjYChAE7
    //geo.ipify.org api to get country code
    axios.get(`https://geo.ipify.org/api/v2/country?apiKey=at_295tWjrAYfuR13xdY5nYQkjYChAE7`)
    .then((res)=>setCountry(res?.data?.location?.country))
    .catch((err)=>console.log(err))
    .finally(()=>setLoading(false));
  },[country]);

  const {data:countryData,isFetching,error} = useGetSongsByCountryQuery(country);

  const getLikedSong = async()=>{
    try {
      const {data} = await api.getLikedSong();
      setLikedSong([...data.data]);
    } catch (error) {
      alert(error.message);
    }
  }
  useEffect(()=>{
    getLikedSong();
  },[]);

  if(isFetching) return <Loader title="Loading Today's Hits"/>;
  if(error && country) return <Error />;

  const handleSong = (i) =>{
    let arr = [];
    countryData.forEach((song)=>{
      let obj = {
        songId : song.key? song.key : null,
        singerName : song?.subtitle,
        songName : song?.title,
        songSrc : song.hub.actions? song.hub.actions[1].uri : null,
        songImgSrc : song?.share?.image
      }
      arr.push(obj);
    })
    dispatch(playSongs(arr,i));
  }

  const handleLikedClick = async(song,idx) =>{
    const val = await LikedSong.handleLikedSong(song);
    let array = songs;
    countryData.forEach((ele,index)=>{
      if(index===idx){
        if(val) array[index]=true;
        else{
          likedSong.forEach((ele,index)=>{
            if(ele.songId===song.key) likedSong.splice(index,1);
          })
          setLikedSong([...likedSong]);
          array[index]=false;
        }
      }
    })
    setSongs([...array]);
  }

  const checkInLikedSong = (obj) =>{
    if(!obj.key) return false;
    let check = false;
    likedSong.forEach((ele)=>{
      if(ele.songId===obj.key){
        check = true;
      }
    })
    return check;
  }

  return (
    <div className="artist-container">
      <div className="top-section">
        <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c2luZ2VyfGVufDB8fDB8fA%3D%3D&w=1000&q=80" alt="pic" />
        <div className="btm-effect"></div>
      </div>
      <div className="musicList">
        <h2 className="title">
          Trending Now {country}
          <i id="play-all-margin" onClick={()=>handleSong(0)}><GoPlay /></i>
        </h2>
        <div className="song-container">
          {countryData &&
            countryData.map((obj, index) => (
              <div className="songs" key={index}>
                <div className="count">{index + 1}</div>
                <div className="song">
                  <div className="img">
                    <img src={obj.share?.image? obj.share.image : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c2luZ2VyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"} alt="pic" />
                  </div>

                  <div className="content-section">
                    <p className="songName" onClick={()=>handleSong(index)}>
                      {obj.title}
                      <span className="singerName">{obj.subtitle}</span>
                    </p>

                    <div className="loved">
                      { (checkInLikedSong(obj) || songs[index]) ? <i id="fill-heart"  onClick={()=>handleLikedClick(obj,index)}><FaHeart /></i>:<i id="fill-heart"  onClick={()=>handleLikedClick(obj,index)}> <FiHeart /></i>}
                      <Link to={`/songs/${obj.key}`} style={{"color":"white"}}><i id="three-x-dot"><BsThreeDotsVertical /></i></Link>
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

export default AroundYou;