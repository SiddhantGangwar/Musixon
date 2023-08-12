import { PLAY_SONGS,PLAY_QUEUE,REMOVE_QUEUE,FREE_QUEUE_STATUS,IS_MEDIA_LIKED,CLEAR_USER_MEDIA} from "./playerActionType";

export const playSongs = (songs,index=0) =>{
   return{
    type : PLAY_SONGS,
    index : index,
    payload : songs
   }
}

export const playQueue = (song) =>{
    return{
     type:PLAY_QUEUE,
     payload : song
    }
}

export const removeQueue = () => {
    return{
        type: REMOVE_QUEUE
    }
}

export const freeQueueStatus = () => {
    return{
        type : FREE_QUEUE_STATUS
    }
}

export const isMediaLiked = (flag) =>{
    return{
        type : IS_MEDIA_LIKED,
        payload : flag
    }
}

export const clearUserMedia = () =>{
    return{
        type : CLEAR_USER_MEDIA
    }
}