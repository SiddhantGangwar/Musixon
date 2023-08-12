import React, { useState } from "react";
import "../Styles_sheet/Artists.css";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useGetTopChartsQuery } from "../redux/services/ShazamCore";
import { Link } from "react-router-dom";
import Loader from "../assets/Loader";
import Error from "../assets/Error";

function Artists() {
  const { data, isFetching, error } = useGetTopChartsQuery();
  //eslint-disable-next-line 
  
  const [text,setText] = useState("See All");
  const [size,setSize] = useState(6);

  if (isFetching) return <Loader title="Loading Artists" />;
  if (error) return <Error />;

  const handleAllArtist = () =>{
    if(text==="See All"){
      setText("See Less")
      setSize(data.length);
    }else{
      setText("See All")
      setSize(6);
    }
  }

  return (
    <div className="artist-container">
      <div className="top-picture">
        <img
          src="https://media.istockphoto.com/photos/guitar-player-on-dark-picture-id643965600?b=1&k=20&m=643965600&s=170667a&w=0&h=VyCHYbffCMdOxiXfP1hCIXKStdwQFEf1jISSefILzC4="
          alt="pic"
        />
        <div className="top-name">
          <h2>Top Artists</h2>
        </div>
        <div className="btm-effect"></div>
      </div>
      <div className="artist-section">
        <h2 id="top-artist-sec">Listen Our Top Artists
          <span id="clk-see-all" onClick={handleAllArtist}>{text}</span>
        </h2>
        <div className="artist-card">
          {data &&
            data.slice(0, size).map((obj, idx) => (
              <Link to={`/artists/${obj?.artists? obj.artists[0].adamid : null}`} key={idx}>
                <div className="artist">
                  <img src={obj?.images?.background ? obj.images.background : "https://images7.alphacoders.com/128/1289555.png"} alt="pic" />
                  <i>
                    <BsFillPlayCircleFill />
                  </i>
                  <h3 id="name">{obj?.subtitle? obj.subtitle : "songName"}</h3>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Artists;