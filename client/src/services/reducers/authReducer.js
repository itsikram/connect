import {SET_LOGIN,GET_USER} from '../constants/authConsts'

const initialSate = {
    user: {},
}

const authReducer = (state = initialSate,action) => {
    switch (action.type) {

        case GET_USER: 
            return {
                ...state,
                user: action.payload.user
            }
    
        default:
            return state;
    }
}