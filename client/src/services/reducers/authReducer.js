import {SET_LOGIN,GET_USER} from '../constants/authConsts'

const initialSate = {
    isLoggedIn : false,
    user: {},
}

const authReducer = (state = initialSate,action) => {
    switch (action.type) {
        case SET_LOGIN:
            return {
                ...state,
                isLoggedIn : action.payload.isLoggedIn,
            }

        case GET_USER: 
            return {
                ...state,
                user: action.payload.user
            }
    
        default:
            return state;
    }
}