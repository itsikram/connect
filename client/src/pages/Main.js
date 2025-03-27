import React, { Fragment, useEffect, useState } from "react";

import { BrowserRouter as BR, Routes, Route } from 'react-router-dom'

import Header from '../partials/header/Header';
import Home from "./Home";
import Profile from "./Profile";
import Friends from "./Friends";
import Watch from "./Watch";
import Marketplace from './Marketplace'
import Groups from './Groups'
import Message from "./Message";
import Story from "./Story";
import SingleStory from "../components/story/SingleStory";

import ProfileAbout from "../components/Profile/ProfileAbout";
import PorfilePosts from "../components/Profile/PorfilePosts";
import ProfileFriends from "../components/Profile/ProfileFriends";

import FriendRequests from "../components/friend/FriendRequests";
import FriendSuggest from "../components/friend/FriendSuggest"
import FriendHome from "../components/friend/FriendHome";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/authReducer";
import api from "../api/api";
import { getPorfileReq, getProfileFailed, getProfileSuccess } from '../services/actions/profileActions'
import { setLogin } from "../services/actions/authActions";
import { setBodyHeight, setHeaderHeight } from "../services/actions/optionAction";
import Settings from "./Settings";
import ProfileIkramul from "./ProfileIkramul";
import socket from '../common/socket.js'

function showNotification(msg, receiverId) {
    const notification = new Notification("New Message!", {
        body: msg.message,
        icon: "https://programmerikram.com/wp-content/uploads/2025/03/ics_logo.png"
    });

    // Handle click event
    notification.onclick = () => {
        window.open(`${process.env.REACT_APP_URL}/message/${receiverId}`);
    };
}

const Main = () => {
    var dispatch = useDispatch();
    const [room, setRoom] = useState('');


    let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
    const profileId = userInfo.profile
    useEffect(() => {

        socket.on('notification', (msg) => {
            if (Notification.permission === "granted") {
                showNotification(msg);
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        showNotification(msg);
                    }
                });
            }
            console.log(msg)
        })

        return () => {
            socket.off('notification');
        };
    }, [socket])

    dispatch(setBodyHeight(window.innerHeight));

    useEffect(() => {

        api.post(`/profile`, { profile: profileId }).then(res => {
            dispatch(getPorfileReq())

            if (res.status === 200) {
                dispatch(setLogin({ isLoggedIn: true }))
                dispatch(getProfileSuccess(res.data));

            }

        }).catch(e => {
            dispatch(getProfileFailed(e))
        })
    })



    return (
        <Fragment>
            <BR>

                <Header />

                <div id="main-container">
                    <Routes>
                        <Route path="/">
                            <Route index element={<Home />}></Route>

                            <Route path="/ikramul-islam/" element={<ProfileIkramul />}></Route>

                            <Route path="/:profile/" element={<Profile />}>
                                <Route index element={<PorfilePosts />} />
                                <Route path="about" element={<ProfileAbout />} />
                                <Route path="friends" element={<ProfileFriends />}></Route>
                            </Route>
                            <Route path="/story/" element={<Story />}>
                                <Route index element={<Story />} />
                                <Route path=":storyId" element={<SingleStory />} />
                            </Route>
                            <Route path="/friends/" element={<Friends />}>
                                <Route index element={<FriendHome />}></Route>
                                <Route path="requests" element={<FriendRequests />}></Route>
                                <Route path="suggestions" element={<FriendSuggest />}></Route>

                            </Route>
                            <Route path="/watch" element={<Watch />}> </Route>
                            <Route path="/message" element={<Message />}>
                                <Route path=":profile/" element={<Profile />}></Route>

                            </Route>
                            <Route path="/marketplace" element={<Marketplace />}> </Route>

                            <Route path="/groups" element={<Groups />}> </Route>
                            <Route path="/settings" element={Settings}></Route>

                        </Route>

                    </Routes>

                </div>

            </BR>
        </Fragment>

    )


}

export default Main