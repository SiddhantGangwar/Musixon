import { IS_USER_EXISTS,USER_DATA,CLEAR_USER_DATA} from "./userActionType";

export const isUserExist = (flag) =>{
  return{
    type : IS_USER_EXISTS,
    payload : flag
  }
}

export const setUserData = (obj) =>{
  return{
    type : USER_DATA,
    payload : obj
  }
}

export const clearUserData = () => {
  return{
    type : CLEAR_USER_DATA
  }
}