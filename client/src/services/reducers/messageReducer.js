import { ADD_MESSAGE, ADD_MESSAGES, NEW_MESSAGE,SEND_MESSAGE } from "../constants/messageConsts";
let initialState = []
const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        // case GET_NOTIFICATIONS:
        //     return [
        //         ...state,
        //     ];
        //     break;

        case ADD_MESSAGE:
            let newMessage = action.payload
            let isMsgExits = state.filter(noti => noti._id === action.payload._id)
            if (isMsgExits.length > 0) return state;
            return [
                ...state,
                newMessage
            ];
            break;

        case ADD_MESSAGES:
            let newMessages = action.payload
            let isReset = action.reset || false


            if (isReset) {
                return [
                    ...newMessages
                ];
            } else {
                return [

                    ...state,
                    ...newMessages
                ];
            }

            break;

        case NEW_MESSAGE:
            let newMsg = action.payload
            let contactId = newMsg.senderId
            let otherContacts = state.filter(state => state.person._id !== contactId)

            let updatedContact = state.filter(state => state.person._id === contactId)
            updatedContact.messages = [newMsg]

            return [
                ...updatedContact,
                ...otherContacts,
            ];
            
            break;

        case SEND_MESSAGE:
            let newMsgSent = action.payload
            let newContactId = newMsgSent.receiverId

            let newOtherContacts = state.filter(state => state.person._id !== newContactId)

            let newUpdatedContact = state.filter(state => state.person._id === newContactId)

            newUpdatedContact.messages = [newMsgSent]

            return [
                ...newUpdatedContact,
                ...newOtherContacts,
            ];
            break;

        default:
            return state;
    }
}

export default messageReducer;