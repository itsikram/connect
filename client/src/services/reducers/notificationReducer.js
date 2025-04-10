import { GET_NOTIFICATIONS, ADD_NOTIFICATION, ADD_NOTIFICATIONS, VIEW_NOTIFICATION } from "../constants/notificationConsts";
let initialState = []
const notificaitonReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_NOTIFICATIONS:
            return [
                ...state,
            ];
            break;

        case ADD_NOTIFICATION:
            let newNotification = action.payload
            return [

                ...state,
                newNotification
            ];
            break;

        case ADD_NOTIFICATIONS:
            let newNotifications = action.payload
            return [

                ...state,
                ...newNotifications
            ];
            break;

        case VIEW_NOTIFICATION:
            let notiId = action.payload
            let oldNotifications = state.filter(noti => noti._id !== notiId)
            let viewdNoti = state.filter(noti => noti._id === notiId)
            viewdNoti[0].isSeen = true
            console.log('VIEW_NOTIFICATION', oldNotifications, viewdNoti)
            return [
                ...oldNotifications,
                viewdNoti[0]
            ];
            break;


        default:
            return state;
    }
}

export default notificaitonReducer;