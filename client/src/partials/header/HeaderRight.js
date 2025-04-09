import React, { Fragment, useEffect, useState, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import $ from 'jquery';
import MegaMC from "../../components/MegaMC";
import UserPP from "../../components/UserPP";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../store(unused)/authReducer";
import MessageList from "../../components/Message/MessageList";
import { current } from "@reduxjs/toolkit";
let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
const profilePath = "/" + userInfo.profile + "/"
const default_pp_url = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';

let HeaderRight = () => {
    let profileData = useSelector(state => state.profile)
    let dispatch = useDispatch()
    let [isMsgMenu, setIsMsgMenu] = useState(false);
    let [isProfileMenu, setIsProfileMenu] = useState(false);
    let [isNotificationMenu, setIsNotificationMenu] = useState(false);
    let location = useLocation();
    let msgMegaMenuContainer = useRef(null);
    let msgMegaMenu = msgMegaMenuContainer.current ? msgMegaMenuContainer.current.children[0] : null;
    const [imageExists, setImageExists] = useState(null);
    var pp_url = profileData.profilePic;
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
    }, [location])

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

    let quickMenuBtnClick = (e) => {


        // let target = e.currentTarget;

        // $(target).siblings().removeClass('active')

        // if ($(target).hasClass('active') !== true) {
        //     $(target).addClass('active')

        //     $(target).children('.hr-mega-menu').show('fast')

        // } else {
        //     $(target).removeClass('active')
        //     $(target).children('.hr-mega-menu').hide('fast')
        //     $(target).siblings().removeClass('active')
        // }


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
                    <li onClick={showMsgList} className={`header-quick-menu-item ${isMsgMenu ? 'active' : ''}`} title="Groups">
                        <div className="header-quick-menu-icon">
                            <i className="far fa-comment-alt-lines"></i>
                        </div>
                        {
                            isMsgMenu && (
                                <MegaMC style={{ right: '0px !important', top: '101%', width: '300px', backgroundColor: '#242526', borderRadius: '5px', display: 'block', boxShadow: '0px 0px 2px 0px rgba(255,255,255,0.3)' }} className="hr-mega-menu">
                                    <MessageList />
                                </MegaMC>
                            )
                        }

                    </li>

                    <li onClick={showNotificationList} className="header-quick-menu-item" title="">
                        <div className="header-quick-menu-icon">
                            <i className="far fa-bell"></i>

                        </div>
                    </li>
                    {isNotificationMenu && (
                        <MegaMC style={{ right: 0, top: '101%', width: '300px', backgroundColor: '#242526', borderRadius: '5px', display: 'block', boxShadow: '0px 0px 2px 0px rgba(255,255,255,0.3)' }} className="hr-mega-menu">
                            <div className="hr-mm-container">

                                <div className="hr-notificaiton-menu-container">
                                    <ul className="hr-notificaiton-menu">
                                        <li className="hr-notificaiton-item">
                                            <Link to={'/home'}>
                                                <div className="hr-notification-row align-items-center">
                                                    <div className="hr-notification-col-2">
                                                        <div className="hr-notification-icon-continaer">
                                                            <img className="hr-notification-icon" src="https://programmerikram.com/wp-content/uploads/2025/03/ics_logo.png" alt="Notification Icon"/>
                                                        </div>
                                                    </div>
                                                    <div className="hr-notification-col-10"> <p className="hr-notification-text">Lorem Ipsum Dolor Sit amet</p></div>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </MegaMC>
                    )}
                    <li onClick={clickProfileBtn} className="header-quick-menu-item item-profile" title="">
                        <div className="profile-pic">
                            <img src={pp_url} alt="Author Name" />

                        </div>

                    </li>
                    {isProfileMenu && (
                        <MegaMC style={{ right: 0, top: '101%', width: '300px', backgroundColor: '#242526', borderRadius: '5px', display: 'block', boxShadow: '0px 0px 2px 0px rgba(255,255,255,0.3)' }} className="hr-mega-menu">
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