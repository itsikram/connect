import {GET_NOTIFICATION,ADD_NOTIFICATION,ADD_NOTIFICATIONS,VIEW_NOTIFICATION} from '../constants/notificationConsts'

export const addNotification = (notification) => {
    return {
        type: ADD_NOTIFICATION,
        payload: notification
    }
} 
export const addNotifications = (notifications) => {
    return {
        type: ADD_NOTIFICATIONS,
        payload: notifications
    }
} 
export const viewNotification = (notifications) => {
    return {
        type: VIEW_NOTIFICATION,
        payload: notifications
    }
} 
// export const getUser = (userData) => {

//     return {
//         type: GET_USER,
//         payload: userData
//     }
// }