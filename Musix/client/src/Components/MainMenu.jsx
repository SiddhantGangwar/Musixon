import React , {useState} from 'react';
import "../Styles_sheet/MainMenu.css";
import {BsFillPlayCircleFill} from "react-icons/bs";
import SliderList from "../assets/SliderContent"
import { Link } from "react-router-dom";
import Recently from './Recently';
import Trending from './Trending';
import {useNavigate} from "react-router-dom";
import {FiSearch} from "react-icons/fi";
import { useSelector } from 'react-redux';
function MainMenu() {
  const navigate = useNavigate();
  const isPlayer = useSelector(state => state.player.isPlay);
  const [searchTerm,setSearchTerm] = useState("");
  const name = useSelector(state => state.user.userName);

  const handleSubmit =(e)=>{
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
  }
  //slider state hook
  const[slideIndex,setSlideIndex] = useState(1);
    // eslint-disable-next-line
    const nextSlide = ()=>{
      if(slideIndex !== SliderList.length){
        setSlideIndex(slideIndex+1);
      }else if(slideIndex===SliderList.length){
        setSlideIndex(1);
      }
      // console.log(slideIndex+" next");
    }
    // eslint-disable-next-line
    const prevSlide = ()=>{
       if(slideIndex !==1){
         setSlideIndex(slideIndex-1);
       }else if(slideIndex===1){
         setSlideIndex(SliderList.length);
       }
      //console.log(slideIndex+" prev");
    }


  return (
    <div className="mn_menu">
      <div className="sliderContainer">
         <div className="topEffect">
         <form onSubmit={handleSubmit}>
         {/* <Link to={`/search/${searchTerm}`}> <i><FiSearch /></i> </Link> */}
         <i onClick={handleSubmit} style={{"cursor":"pointer"}}><FiSearch /></i>
         <input className="search-input" type="text" placeholder="Search songs,genre,artists..." onChange={(e)=>setSearchTerm(e.target.value)}/>
         </form>
         <div className="lg-sg">
          <Link to={`/profile`}>{name}</Link>
         </div>
        </div>
          {
            SliderList && SliderList.map((obj,index)=>(
              <div className={slideIndex===index+1 ? "slides fade" : "slide"} key={obj.id}>
              <img src={obj.img} alt="pic" className="slider-img rmvFltr"/>

             <div className="slideContent">
                 <div className="middle">
                    {/* <i onClick={prevSlide}><FaArrowCircleLeft/></i> */}
                    <h1>{obj.text}</h1>
                    {/* <i onClick={nextSlide}><FaArrowCircleRight/></i> */}
                 </div>
                 <div className="bottom">
                    <Link id="btm1" to={`/Home/AroundYou`}>
                      <i><BsFillPlayCircleFill/></i>
                      <span>Play</span>
                    </Link>
                 </div>
              </div>
              </div>
              ))
            }
        <div className="btmEffect"></div>
      </div>
      <div className="songs-container">
        <Trending />
        { isPlayer ? <Recently /> : null} 
        </div>   
    </div>
  )
}

export default MainMenu;