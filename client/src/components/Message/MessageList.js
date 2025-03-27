import React, {Fragment, useEffect, useState} from "react";
import UserPP from "../UserPP";
import api from "../../api/api";
import {useSelector} from "react-redux";
import { Link } from "react-router-dom";




let userInfo = JSON.parse((localStorage.getItem('user')||'{}'))
const profileId = userInfo.profile
const MessageList = ()=> {

    let myProfile = useSelector(state => state.profile)
    const [messageList,setMessageList] = useState([])

    useEffect(()=> {

        api.get('/friend/getFriends',{
            params: {
                profile:  profileId
            }
        }).then(res => {
            setMessageList(res.data)
        }).catch(e => console.log(e))

    },[])

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
                            messageList.map((messageItem,key) => {
                                let authorFullName = messageItem.user.firstName + ' '+ messageItem.user.surname
                                
                                return <Link key={key} style={{textDecoration: 'none'}} to={`/message/${messageItem._id}`}>
                                <li className={"message-list-item"}>
                                    <div className={"user-profilePic"}>
                                        <UserPP profilePic={messageItem.profilePic} profile={messageItem.user.profile}></UserPP>
                                    </div>
                                    <div className={'user-data'}>
                                        <h4 className={"message-author-name"}>{authorFullName}</h4>
                                        <p className={"last-message-data"}>
                                            <span className={"last-message"}></span>
                                            

                                            <span className={"lest-msg-time"}></span></p>
                                    </div>
                                </li></Link> 

                            })
                        }
                        {
                            messageList.length ===0 && <h4 className={"data-not-found"}>No Message List to Show</h4>
                        }
                    </ul>
                </div>
            </div>

        </Fragment>
    )
}

export default MessageList;