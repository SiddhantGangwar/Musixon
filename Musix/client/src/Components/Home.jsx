import React , {useEffect , useState} from 'react';
import  {GiMusicSpell}  from "react-icons/gi";
import  {BsThreeDots}  from "react-icons/bs";
import {RiDeleteBin5Fill} from "react-icons/ri";
import "../Styles_sheet/leftSidebar.css";
import NavBarList from '../assets/NavBarList';
import { Link } from "react-router-dom"
import  {FcList} from "react-icons/fc"
import {RiPlayListLine} from "react-icons/ri"
import * as api from "../api/index.js";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Home() {
  const [userList,setUserList] = useState([]);
  const [playListForm,setPlayListForm] = useState(false);
  const [playListData,setPlayListData] = useState({playlistname: ""});
  //eslint-disable-next-line
  const [cookies,setCookie,removeCookie]  = useCookies([]);
  const navigate = useNavigate();
  //Adding active class on the navbars

  const getPlayList = async() =>{
    try {
      const {data} = await api.getPlayList();
      if(data){
        let arr = [];
        data.data.forEach((ele)=>{
          let obj = {
            id : ele.playListId,
            name : ele.playListName
          }
          arr.push(obj);
        });
        setUserList([...arr]);
      }
    } catch (error) {
      //console.log(error);
      //alert(error.message);
    }
  }

  useEffect(()=>{
    getPlayList();
  },[cookies])

  useEffect(()=>{
    const allAnchor = document.querySelector(".lf_menu .sectionContainer").querySelectorAll("a");
       
    function changeActive(){
      allAnchor.forEach((i)=>i.classList.remove("active"));
      this.classList.add("active");
    }
    
    allAnchor.forEach((i)=>i.addEventListener("click",changeActive));
  },[]);

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setPlayListData((preValue) => {
      return {
        ...preValue,
        [name] : value,
      };
    });
  }

  const handleSubmit = async() =>{
    try {
      const {data} = await api.createPlayList(playListData);
      let arr = [];
      data.result.playList.forEach((ele)=>{
        let obj = {
          id : ele.playListId,
          name : ele.playListName
        }
        arr.push(obj);
      });
      setUserList([...arr]);
      setPlayListForm(false);
    } catch (error) {
      //alert(error.message);
    }
  }

  const handleDeletePlayList = async(id)=>{
    const playListData = {playListId : id};
    try {
      // eslint-disable-next-line
      const {data} = await api.deletePlayList(playListData);
      await getPlayList();
      navigate(`/`);
    } catch (error) {
      //alert(error.message);
    }
  }

  return(
    <div className="lf_menu">
      
      {/* Logo section */}

      <div className="logoContainer">
         <i className="first-logo"><GiMusicSpell /></i>
         <h2>MusixON</h2>
         <i className="second-logo"><BsThreeDots /></i>
      </div>
      
      {/* This section conatins various navigation bar links */}
      <div className="sectionContainer">
      {
        NavBarList && NavBarList.map((obj)=>(
          <div className="chSecContaier" key={obj.id}>
          { obj.name!=="CreatePlaylist" ?  <Link to={`/${obj.route}`} style={{"display":"flex"}}>
           <i className='sec-logo'> {obj.icon} </i>
           <span className="sec-head"> {obj.name} </span>
          </Link> :
          <div className="playList-sec">
           <div style={{"display":"flex"}} onClick={()=>setPlayListForm(prev=>!prev)}>
           <i className='sec-logo'> {obj.icon}  </i>
           <span className="sec-head" style={{"cursor":"pointer"}} > {obj.name} </span>
           </div>
           {playListForm ?
             <>
             <div>
              <input type="text" name="playlistname" placeholder="Enter name" onChange={handleChange} />
             </div>
             <div>
              <input type="submit" onClick={handleSubmit}/>
             </div>
             </> 
           : null}
          </div>
          }
          </div>
        ))
      }
      {/* <MyPlaylist userList={userList}/> */}
      <div className="playListContainer">
        <div className="nameOfPlaylist">
           <p>My Playlist</p>
           <i><FcList/></i>
        </div>
        <div className="playlistContent">
         { 
           userList && userList.map((obj)=>(
            <div className="childPlay" key={obj.id}>
            <i><RiPlayListLine/></i>
            {/* eslint-disable-next-line */}
            <Link to={`/Home/${obj.name}/${obj.id}`} style={{"textDecoration":"none","cursor":"pointer"}} id="playListName" >{obj.name}</Link>
            <i style={{"cursor":"pointer"}} onClick={()=>handleDeletePlayList(obj.id)}><RiDeleteBin5Fill /></i>
            </div>
          ))
         }
        </div>
        </div>
      </div>
    </div>
  );
}

export default Home;