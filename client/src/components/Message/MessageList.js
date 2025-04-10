import React, { Fragment, useEffect, useState } from "react";
import UserPP from "../UserPP";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { Link ,useParams,useLocation} from "react-router-dom";
import socket from "../../common/socket";
import Moment from "react-moment";


let isProfileActive = (id) => {
    return true
    socket.emit('is_active', { profileId: id, myId: profileId })
    socket.on('is_active', (isUserActive) => {
        console.log(id,isUserActive)
        return () =>{
            return isUserActive;
        } 


    })


}

function truncateString(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
}

let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
const profileId = userInfo.profile
const MessageList = () => {
    // const [isActive, setIsActive] = useState(false);
    const [activeFriends, setActiveFriends] = useState([]);
    let params = useParams();
    let location = useLocation();
    let myProfile = useSelector(state => state.profile)
    let myId = myProfile._id
    let myContacts = useSelector(state => state.message)
    useEffect(() => {

        myContacts && myContacts.map((contact,key) => {


            let contactPerson = contact.person
            let contactMessages = contact.messages

            socket.emit('is_active', { profileId: contactPerson._id, myId: profileId })
            socket.on('is_active', (isUserActive,lastLogin, activeProfileId) => {
                if (isUserActive == true) {
                    if (!activeFriends.includes(activeProfileId)) {
                        return setActiveFriends([...activeFriends, activeProfileId] )
                    }
                }

            })
            return () => socket.off('is_active');

        })

        return () => socket.off('is_active');

    }, [myContacts])


    return (
        <Fragment>
            <div className={"left-sidebar-container"}>
                <div className={"message-leftside-header"}>
                    <h2 className={"message-leftside-title"}>
                        Chats
                    </h2>
                    <div className={"message-sidebar-header-menu"}>
                        <div className={"header-menu-icons"}>
                            <i className={"far fa-ellipsis-h"}></i>
                        </div>
                    </div>
                </div>
                <div className={"message-list-container"}>
                    <ul className={"message-list"}>
                        {
                            myContacts ? myContacts.map((contactItem, key) => {
                                let contactPerson = contactItem.person;
                                let contactMessages = contactItem.messages || [];
                                let authorFullName = contactPerson?.fullName
                                let isMsgSeen =  (contactMessages[0] ? ( contactMessages[0].senderId == myId ? true : contactMessages[0].isSeen) : false) 
                                let isFrndActive = activeFriends.includes(contactPerson._id)
                                return <Link key={key} style={{ textDecoration: 'none' }} to={`/message/${contactPerson._id}`}>
                                    <li className={`message-list-item ${isMsgSeen ? 'message-seen' : 'message-unseen'}`}>
                                        <div className={"user-profilePic"}>
                                            <UserPP profilePic={contactPerson.profilePic} profile={contactPerson._id} active={isFrndActive}></UserPP>
                                        </div>
                                        <div className={'user-data'}>
                                            <h4 className={"message-author-name"}>{authorFullName}</h4>
                                            <p className={"last-message-data"}>
                                                <span className={"last-message"}>{truncateString(contactMessages && contactMessages[0]?.message || '',45)} </span>
                                                {contactMessages && contactMessages.length > 0? (<span className={"last-msg-time"}>| <Moment fromNow>{contactMessages && contactMessages[0].timestamp}</Moment></span>) : <></> } 
                                                </p>
                                        </div>
                                    </li></Link>

                            }) : <h4 className={"data-not-found"}>No Message List to Show</h4>
                        }

                    </ul>
                </div>
            </div>

        </Fragment>
    )
}

export default MessageList;