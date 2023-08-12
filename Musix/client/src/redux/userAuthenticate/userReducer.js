import { IS_USER_EXISTS,USER_DATA,CLEAR_USER_DATA } from "./userActionType";

const initialState = {
    userExist : false,
    userName : "",
    userEmail : "",
    userDob : "",
    userGender : "",
    userRegion : ""
}

const userReducer = (state = initialState,action) =>{
    switch(action.type){
        case IS_USER_EXISTS : return{
            ...state,
            userExist : action.payload
        }
        case USER_DATA : return{
            ...state,
            userName : action.payload.name ? action.payload.name : "",
            userEmail : action.payload.email ? action.payload.email : "",
            userDob : action.payload.dob ? action.payload.dob : "",
            userGender : action.payload.gender ? action.payload.gender : "",
            userRegion : action.payload.country ? action.payload.country : ""
        } 
        case CLEAR_USER_DATA : return{
            userExist : false,
            userName : "",
            userEmail : "",
            userDob : "",
            userGender : "",
            userRegion : "" 
        }
        default : return state
    }
}

export default userReducer;