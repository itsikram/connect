import React, { Fragment, useEffect, useState } from "react";
import UserPP from "../UserPP";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { Link ,useParams,useLocation} from "react-router-dom";
import socket from "../../common/socket";



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
let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
const profileId = userInfo.profile
const MessageList = () => {
    // const [isActive, setIsActive] = useState(false);
    const [activeFriends, setActiveFriends] = useState([]);
    let params = useParams();
    let location = useLocation();
    let myProfile = useSelector(state => state.profile)
    useEffect(() => {

        myProfile.friends && myProfile.friends.map((profile,key) => {

            socket.emit('is_active', { profileId: profile._id, myId: profileId })
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

    }, [myProfile,setTimeout(() =>{ return true}),[2000]])


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
                            myProfile?.friends && myProfile.friends.length > 0 ? myProfile.friends && myProfile.friends.map((messageItem, key) => {
                                let authorFullName = messageItem.fullName

                                let isFrndActive = activeFriends.includes(messageItem._id)

                                return <Link key={key} style={{ textDecoration: 'none' }} to={`/message/${messageItem._id}`}>
                                    <li className={"message-list-item"}>
                                        <div className={"user-profilePic"}>
                                            <UserPP profilePic={messageItem.profilePic} profile={messageItem._id} active={isFrndActive}></UserPP>
                                        </div>
                                        <div className={'user-data'}>
                                            <h4 className={"message-author-name"}>{authorFullName}</h4>
                                            <p className={"last-message-data"}>
                                                <span className={"last-message"}></span>
                                                <span className={"last-msg-time"}></span></p>
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