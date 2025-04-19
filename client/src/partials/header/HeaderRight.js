import React, { Fragment, useEffect, useState, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import Moment from "react-moment";
import MegaMC from "../../components/MegaMC";
import UserPP from "../../components/UserPP";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../store(unused)/authReducer";
import MessageList from "../../components/Message/MessageList";
import api from "../../api/api";
import { viewNotification } from "../../services/actions/notificationActions";
let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
const profilePath = "/" + userInfo.profile + "/"
const default_pp_url = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';

let HeaderRight = () => {
    let profileData = useSelector(state => state.profile)
    let optionData = useSelector(state => state.option)
    let notificaitonData = useSelector(state => state.notification)
    let messageData = useSelector(state => state.message)
    let dispatch = useDispatch()
    let [isMsgMenu, setIsMsgMenu] = useState(false);
    let [isProfileMenu, setIsProfileMenu] = useState(false);
    let [isNotificationMenu, setIsNotificationMenu] = useState(false);
    let [totalNotifications, setTotalNotifications] = useState(0)
    let [totalMessages, setTotalMessages] = useState(0)
    let location = useLocation();
    const [imageExists, setImageExists] = useState(null);
    var pp_url = profileData.profilePic;


    let notificationMenuHeight = optionData.bodyHeight - optionData.headerHeight - 100
    let notificationMenuStyle = { maxHeight: notificationMenuHeight + 'px', overflowY: 'scroll' }
    const checkImage = (url) => {
        const img = new Image();
        img.src = url;

        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
    };

    checkImage(pp_url)
    if (!imageExists) {
        pp_url = default_pp_url;
    }
    useEffect(() => {
        setIsMsgMenu(false)
        setIsProfileMenu(false)
        setIsNotificationMenu(false)
    }, [location])

    useEffect(() => {
        let unseenNotifications = notificaitonData.filter(data => data.isSeen === false)
        setTotalNotifications(unseenNotifications.length)
    }, [notificaitonData])
    useEffect(() => {
        let unseenMessages = messageData.filter(data => data.messages.length > 0 && data.messages[0].senderId !== profileData._id && data.messages[0]?.isSeen === false)
        setTotalMessages(unseenMessages.length)
    }, [messageData])

    let showMsgList = (e) => {
        setIsMsgMenu(!isMsgMenu)
        setIsProfileMenu(false)
        setIsNotificationMenu(false)
    }

    let clickProfileBtn = () => {
        setIsProfileMenu(!isProfileMenu)
        setIsMsgMenu(false)
        setIsNotificationMenu(false)
    }

    let showNotificationList = () => {
        setIsNotificationMenu(!isNotificationMenu)
        setIsProfileMenu(false)
        setIsMsgMenu(false)
    }

    let handleNotificationClick = async (e) => {
        let notificationId = e.currentTarget.dataset.id
        let updatedNotification = await api.post('/notification/view', { notificationId })
        if (updatedNotification.status == 200) {
            dispatch(viewNotification(notificationId))
        }
    }

    let logOutBtn = (e) => {
        dispatch(logOut())
        localStorage.removeItem('user')
        window.location.reload();
    }
    return (
        <Fragment>
            <div className="header-quick-menu-container">
                <ul className="header-quick-menu">
                    <li onClick={showMsgList} className={`header-quick-menu-item ${isMsgMenu ? 'active' : ''}`} title="Message">
                        <div className="header-quick-menu-icon">
                            <i className="far fa-comment-alt-lines"></i>
                           {totalMessages > 0 && (<span className="hr-counter-badge"><span className="counter">{totalMessages}</span></span>)} 
                        </div>
                    </li>
                    {
                        isMsgMenu && (
                            <MegaMC style={{ right: '50%', transform: 'translateX(50%)', top: '101%', width: '300px', backgroundColor: '#242526', borderRadius: '5px', display: 'block', boxShadow: '0px 0px 2px 0px rgba(255,255,255,0.3)' }} className="hr-mega-menu">
                                <MessageList />
                            </MegaMC>
                        )
                    }
                    <li onClick={showNotificationList} className={`header-quick-menu-item ${isNotificationMenu ? 'active' : ''}`} title="">
                        <div className="header-quick-menu-icon">
                            <i className="far fa-bell"></i>
                            {totalNotifications > 0 && (<span className="hr-counter-badge"><span className="counter">{totalNotifications}</span></span>)}
                        </div>
                    </li>
                    {isNotificationMenu && (
                        <MegaMC style={{ right: '50%', transform: 'translateX(50%)', top: '101%', width: '300px', backgroundColor: '#242526', borderRadius: '5px', display: 'block', boxShadow: '0px 0px 2px 0px rgba(255,255,255,0.3)' }} className="hr-mega-menu">
                            <div className="hr-mm-container">
                                {
                                    notificaitonData.length > 0 ? (
                                        <div className="hr-notification-menu-container">
                                            <div className={"notification-leftside-header"}>
                                                <h2 className={"notification-leftside-title"}>
                                                    Notifications
                                                </h2>
                                                <div className={"notification-sidebar-header-menu"}>
                                                    <div className={"header-menu-icons"}>
                                                        <i className={"far fa-ellipsis-h"}></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="hr-notification-menu" style={notificationMenuStyle}>

                                                {
                                                    notificaitonData.map((notification, key) => {
                                                        return (<li className={`hr-notification-item ${notification.isSeen == false && 'unseen'}`} data-id={notification._id} onClick={handleNotificationClick.bind(this)} key={key}>
                                                            <Link to={notification.link || ''}>
                                                                <div className="hr-notification-row align-items-center">
                                                                    <div className="hr-notification-col-2">
                                                                        <div className="hr-notification-icon-continaer">
                                                                            <img className="hr-notification-icon" src={notification.icon} alt="Notification Icon" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="hr-notification-col-10"> <p className="hr-notification-text">{notification.text} . <Moment fromNow>{notification.timestamp}</Moment></p></div>
                                                                </div>
                                                            </Link>
                                                        </li>)
                                                    })
                                                }


                                            </ul>
                                        </div>
                                    ) : (<p className="text-muted text-center mb-0">No Notification Found</p>)}

                            </div>
                        </MegaMC>
                    )}
                    <li onClick={clickProfileBtn} className="header-quick-menu-item item-profile" title="">
                        <div className="profile-pic">
                            <img src={pp_url} alt="Author Name" />

                        </div>

                    </li>
                    {isProfileMenu && (
                        <MegaMC style={{ right: '50%', transform: 'translateX(50%)', top: '101%', width: '300px', backgroundColor: '#242526', borderRadius: '5px', display: 'block', boxShadow: '0px 0px 2px 0px rgba(255,255,255,0.3)' }} className="hr-mega-menu">
                            <div className="hr-mm-container">
                                <Link to={profilePath}>

                                    <div className="all-profiles">
                                        {
                                            profileData && <UserPP profilePic={profileData.profilePic} />

                                        }
                                        <span className="text-capitalize"> {profileData.fullName ? profileData.fullName : profileData.user && profileData.user.firstName + ' ' + profileData.user.surname} </span>
                                    </div>
                                </Link>
                                <div className="profile-menus">
                                    <Link to="/settings" className="profile-menu-item">
                                        <div className="menu-item-icon">
                                            <i className="fa fa-cog"></i>
                                        </div>
                                        <span className="menu-item-name">Settings</span>
                                    </Link>
                                    <a href="#" onClick={logOutBtn} className="profile-menu-item">
                                        <div className="menu-item-icon">
                                            <i className="fa fa-sign-out-alt"></i>
                                        </div>
                                        <span className="menu-item-name">LogOut</span>
                                    </a>
                                </div>

                            </div>
                        </MegaMC>
                    )}
                </ul>
            </div>
        </Fragment>
    )
}

export default HeaderRight