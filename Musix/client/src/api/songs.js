import * as api from "./index.js";

export const handleLikedSong = async(song)=>{
    if(!song.key || !song.hub.actions || !song.hub.actions[1].uri) return;
    const songData = {
      songId : song.key,
      singerName : song?.subtitle,
      songName : song?.title,
      songSrc : song.hub.actions[1].uri,
      songImgSrc : song?.share?.image
    };
    //checkliked and send to backend
    const val = await checkLikedSong(song.key);
    if(val){
      const rmvSongData = {
        songId : `${song.key}`
      };
      try {
        // eslint-disable-next-line
        const {data} = await api.removeLiked(rmvSongData);
        return false;
      } catch (error) {
        //alert(error.message);
        // console.log(error);
      }
    }else{
      try {
        // eslint-disable-next-line
        const {data} = await api.addliked(songData);
        return true;
      } catch (error) {
        //alert(error.message);
        //console.log(error);
      }
    }
}

export const checkLikedSong = async(id)=>{
    //send data to backend to check the song is present or not
    const songData = {
      songId : id
    };
    try {
      const {data} = await api.checkLiked(songData);
      if(!data || !data.message) return false; 
    } catch (error) {
      //alert(error.message);
      //console.log(error);
    }
    return true;
}

export const handleArtistSongs = async(song) => {
  if(!song.id || !song.attributes.previews || !song.attributes.previews[0].url) return;
    const songData = {
      songId : song.id,
      singerName : song?.attributes?.artistName,
      songName : song?.attributes?.name,
      songSrc : song?.attributes?.previews[0]?.url,
      songImgSrc : song?.attributes?.artwork?.url
    };
    //checkliked and send to backend
    const val = await checkLikedSong(song.id);
    if(val){
      const rmvSongData = {
        songId : `${song.id}`
      };
      try {
        // eslint-disable-next-line
        const {data} = await api.removeLiked(rmvSongData);
        return false;
      } catch (error) {
        //alert(error.message);
        //console.log(error);
      }
    }else{
      try {
        // eslint-disable-next-line
        const {data} = await api.addliked(songData);
        return true;
      } catch (error) {
        //alert(error.message);
        //console.log(error);
      }
    } 
}