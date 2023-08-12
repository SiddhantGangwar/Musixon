import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSongsBySearchQuery } from "../redux/services/ShazamCore";
import Loader from "../assets/Loader";
import Error from "../assets/Error";
import "../Styles_sheet/Search.css";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { playSongs } from "../redux";

function Search() {
  /*
  //Regex filter method
  const regexMethod = (nam,str) =>{
    var val=0;
    nam = nam.substring(0,5).toLowerCase();
    str = str.substring(0,5).toLowerCase();
    //regex patter from the user input
    var pattern = str?.split("").map((it)=>{
      return `(?=.*${it})`; 
    }).join("");

    var regex = new RegExp(`${pattern}`,"g");
    if(nam.match(regex)) val=1;
    return val;
  }

  allSongs.filter((value) => {
    if (searched === "") return null;
      else if(includeMethod(value?.song_name,searched) || regexMethod(value?.song_name,searched)){
        return value;
      }
    }).map((value, index) => {
  */
  const dispatch = useDispatch();
  const [textSong, setTextSong] = useState("See All");
  const [sizeSong, setSizeSong] = useState(7);
  const [textArtist, setTextArtist] = useState("See All");
  const [sizeArtist, setSizeArtist] = useState(7);
  const { searchTerm } = useParams();
  const { data, isFetching, error } = useGetSongsBySearchQuery(searchTerm);
  if (isFetching) return <Loader />;
  if (error) return <Error />;

  const songs = data?.tracks?.hits?.map((song) => song.track);
  const artist = data?.artists?.hits?.map((song) => song.artist);

  //console.log(songs);
  // console.log(artist);

  const handleClick = (ele) => {
    if (ele === "song") {
      if (textSong === "See All") {
        setTextSong("See Less");
        setSizeSong(songs.length);
      } else {
        setTextSong("See All");
        setSizeSong(7);
      }
    } else {
      if (textArtist === "See All") {
        setTextArtist("See Less");
        setSizeArtist(songs.length);
      } else {
        setTextArtist("See All");
        setSizeArtist(7);
      }
    }
  };

  const handleSong = (i) => {
    let arr = [];
    songs.forEach((song) => {
      let obj = {
        songId : song.key? song.key : null,
        singerName : song?.subtitle,
        songName : song?.title,
        songSrc : song.hub.actions? song.hub.actions[1].uri : null,
        songImgSrc : song?.share?.image
      };
      arr.push(obj);
    });
    dispatch(playSongs(arr,i));
  };

  return (
    <div className="search-container">
      <h2 id="head-search" style={{ marginTop: "36px" }}>
        Best Songs of {searchTerm}
        <span onClick={() => handleClick("song")}>{textSong}</span>
      </h2>
      <div className="song-result">
        <div className="song-card">
          {songs &&
            songs.slice(0, sizeSong).map((obj, index) => (
              <div
                className="songs"
                key={obj.key}
                onClick={() => handleSong(index)}
              >
                <img src={obj?.images?.coverart? obj.images.coverart : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c2luZ2VyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"} alt="pic" />
                <Link to={`/songs/${obj.key}`}>
                  <BsFillPlayCircleFill />
                </Link>
                <h3 id="name">{obj.title}</h3>
                <h3 id="singer">{obj.subtitle}</h3>
              </div>
            ))}
        </div>
      </div>
      <h2 id="head-search" style={{ marginTop: "54px" }}>
        Best Artist of {searchTerm}
        {artist.length > 7 ? (
          <span onClick={() => handleClick("artist")}>{textArtist}</span>
        ) : null}
      </h2>
      <div className="song-result">
        <div className="song-card">
          {artist &&
            artist.slice(0, sizeArtist).map((obj, index) => (
              <Link to={`/artists/${obj.adamid}`} key={index}>
                <div className="songs">
                  <img
                    src={
                      obj.avatar
                        ? obj.avatar
                        : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c2luZ2VyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                    }
                    alt="pic"
                  />
                  <i>
                    <BsFillPlayCircleFill />
                  </i>
                  <h3 id="name">{obj.name}</h3>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Search;