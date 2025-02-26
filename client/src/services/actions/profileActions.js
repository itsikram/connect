import {GET_PROFILE_REQ,GET_PROFILE_FAILED,GET_PROFILE_SUCCESS} from '../constants/profileConsts'
import serverConfig from '../../config.json'

export const getPorfileReq = () => {
    return {
        type: GET_PROFILE_REQ
    }
}
export const getProfileSuccess = (profileData) => {
    let profilePicUrl = profileData.profilePic
    let coverPicUrl = `${serverConfig.SERVER_URL}image/coverPic/${profileData.coverPic}`

    let profile = {...profileData, coverPic: coverPicUrl}
    return {
        type: GET_PROFILE_SUCCESS,
        payload: profile

    }
}
export const getProfileFailed = (error) => {
    return {
        type: GET_PROFILE_FAILED,
        payload: error
    }
}

