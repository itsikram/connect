import {SET_LOGIN,GET_PROFILE,GET_USER} from '../constants/authConsts'

export const setLogin = (isLoggedIn) => {

    return {
        type: SET_LOGIN,
        payload: isLoggedIn
    }
} 
export const getUser = (userData) => {

    return {
        type: GET_USER,
        payload: userData
    }
}