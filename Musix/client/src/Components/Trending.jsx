import React, { useState } from 'react'
import {BsFillPlayCircleFill} from "react-icons/bs";
import {useGetTopChartsQuery} from "../redux/services/ShazamCore";
import Loader from "../assets/Loader";
import Error from "../assets/Error";
import {Link} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { playSongs } from '../redux';

function Trending(){
  const dispatch = useDispatch();
  const [text,setText] = useState("See All");
  const [size,setSize] = useState(7);
  const {data,isFetching,error} = useGetTopChartsQuery();
  if(isFetching) return <Loader title="Loading Trending Songs"/>
  if(error) return <Error />
  function handleSong(obj,i){
    let arr = [];
    data.forEach((song)=>{
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
  const handleAllTrendingSongs = () =>{
    if(text==="See All"){
      setText("See Less")
      setSize(data.length);
    }else{
      setText("See All")
      setSize(7);
    }
  }

  return (
    <>
    <h2 id="recent">Trending This Week!! 
      <span onClick={handleAllTrendingSongs}>{text}</span>
    </h2>
    <div className="songs-row">
    <div className="songs-card">
           {
            data && data.slice(0,size).map((obj,idx)=>(
               <div className="songs" key={obj.key} onClick={()=>handleSong(obj,idx)}>
               <img src={obj?.images?.coverart? obj.images.coverart : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c2luZ2VyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"} alt="pic" />
               <Link to={`/songs/${obj.key}`}><BsFillPlayCircleFill/></Link>
               <h3 id="name">{obj?.title}</h3>
               <h3 id="singer">{obj?.subtitle}</h3>
               </div>
            ))
           }
    </div>
    </div>
    </>
  );
}

export default Trending;