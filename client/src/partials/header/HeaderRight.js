import React, { Fragment,useState } from "react";
import { Link, Outlet, NavLink } from 'react-router-dom';
import $ from 'jquery';
import CreatePost from '../../components/post/CreatePost'
import MegaMC from "../../components/MegaMC";
import UserPP from "../../components/UserPP";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../store/authReducer";
import serverConfig from '../../config.json'

let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
const profilePath = "/" + userInfo.profile + "/"
const default_pp_url = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';

let HeaderRight = () => {
    let profileData = useSelector(state => state.profile)
    let dispatch = useDispatch()


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
    let quickMenuBtnClick = (e) => {
        let target = e.currentTarget;

        $(target).siblings().removeClass('active')
        if ($(target).hasClass('active') !== true) {
            $(target).addClass('active')

            $(target).children('.hr-mega-menu').show('fast')

        } else {
            $(target).removeClass('active')
            $(target).children('.hr-mega-menu').hide('fast')
            $(target).siblings().removeClass('active')
        }


    }


    let logOutBtn = (e) => {
        dispatch(logOut())
        localStorage.removeItem('user')

    }
    return (
        <Fragment>
            <div className="header-quick-menu-container">
                <ul className="header-quick-menu">
                    <li onClick={quickMenuBtnClick.bind(this)} className="header-quick-menu-item" title="Groups">
                        <div className="header-quick-menu-icon">
                            <i className="far fa-comment-alt-lines"></i>

                        </div>
                    </li>
                    <li onClick={quickMenuBtnClick} className="header-quick-menu-item" title="">
                        <div className="header-quick-menu-icon">
                            <i className="far fa-bell"></i>

                        </div>
                    </li>
                    <li onClick={quickMenuBtnClick} className="header-quick-menu-item" title="">
                        <div className="header-quick-menu-icon hr-three-dot">

                            <i className="far fa-ellipsis-v"></i>
                            <i className="far fa-ellipsis-v"></i>
                            <i className="far fa-ellipsis-v"></i>

                        </div>
                    </li>
                    <li onClick={quickMenuBtnClick} className="header-quick-menu-item item-profile" title="">
                        <div className="profile-pic">
                            <img src={pp_url} alt="Author Name" />

                        </div>
                        <MegaMC style={{ right: 0, top: '100%', width: '300px', backgroundColor: '#29B1A9', borderRadius: '5px' }} className="hr-mega-menu">
                            <div className="hr-mm-container">
                                <Link to={profilePath}>

                                    <div className="all-profiles">
                                        {
                                            profileData && <UserPP profilePic={profileData.profilePic} />

                                        }
                                        <span className="text-capitalize"> {profileData.user && profileData.user.firstName + ' ' + profileData.user.surname} </span>
                                    </div>
                                </Link>
                                <div className="profile-menus">
                                    <Link to="/settings" className="profile-menu-item">
                                        <div className="menu-item-icon">
                                            <i className="fa fa-cog"></i>
                                        </div>
                                        <span className="menu-item-name">Settings</span>
                                    </Link>
                                    <a href="" onClick={logOutBtn} className="profile-menu-item">
                                        <div className="menu-item-icon">
                                            <i className="fa fa-sign-out-alt"></i>
                                        </div>
                                        <span className="menu-item-name">LogOut</span>
                                    </a>
                                </div>

                            </div>
                        </MegaMC>
                    </li>
                </ul>
            </div>
        </Fragment>
    )
}

export default HeaderRight