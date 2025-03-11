import {SET_HEADER_HEIGHT,SET_BODY_HEIGHT} from '../constants/optionConsts'

export const setHeaderHeight = (height) => {

    return {
        type: SET_HEADER_HEIGHT,
        payload: height
    }
} 

export const setBodyHeight= (height) => {

    return {
        type: SET_BODY_HEIGHT,
        payload: height
    }
} 