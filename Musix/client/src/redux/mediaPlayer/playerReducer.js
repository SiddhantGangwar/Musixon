import { PLAY_SONGS,PLAY_QUEUE,REMOVE_QUEUE,FREE_QUEUE_STATUS,IS_MEDIA_LIKED,CLEAR_USER_MEDIA} from "./playerActionType";

const initialPlayerState = {
    isPlay : false,
    isSongPlay : false,
    songs : [],
    queueSongs : [],
    queueMsg : "",
    isStatusFreed : true,
    isSongLiked : false
}

const playerReducer = (state = initialPlayerState,action) => {
    let arr = [];
    let msg = "";
    if(action.type===PLAY_QUEUE){
      arr = state.queueSongs;
      arr.push(action.payload);
      msg = "Added to your queue.";
    }else if(action.type===REMOVE_QUEUE){
      arr = state.queueSongs;
      arr.splice(0,1);
    }
    switch(action.type){
      case PLAY_SONGS : return {
        ...state,
        isPlay : true,
        isSongPlay:true,
        index : action.index,
        songs : action.payload,
        isSongLiked : false
      }
      case PLAY_QUEUE : return {
        ...state,
        isPlay : true,
        queueSongs : arr,
        queueMsg : msg,
        isStatusFreed : false
      }
      case REMOVE_QUEUE : return{
        ...state,
        queueSongs : arr
      }
      case FREE_QUEUE_STATUS : return {
        ...state,
        queueMsg : "",
        isStatusFreed : true
      }
      case IS_MEDIA_LIKED : return {
        ...state,
        isSongLiked : action.payload
      }
      case CLEAR_USER_MEDIA : return{
        isPlay : false,
        isSongPlay : false,
        songs : [],
        queueSongs : [],
        queueMsg : "",
        isStatusFreed : true,
        isSongLiked : false
      }
      default : return state
    }
}
export default playerReducer;