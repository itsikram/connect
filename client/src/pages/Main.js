import React, { Fragment, useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as BR, Routes, Route, Link, useParams, useLocation } from 'react-router-dom'
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
import api from "../api/api";
import { getPorfileReq, getProfileFailed, getProfileSuccess } from '../services/actions/profileActions'
import { addNotification, addNotifications } from "../services/actions/notificationActions.js";
import { setLogin } from "../services/actions/authActions";
import { setBodyHeight, setHeaderHeight, setLoading } from "../services/actions/optionAction";
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

const speakText = (text) => {
    if (!text) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; // Change language if needed
    speech.rate = 1; // Speed (0.5 - 2)
    speech.pitch = 1; // Pitch (0 - 2)

    window.speechSynthesis.speak(speech);
};

const Main = () => {
    var dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    let isLoading = useSelector(state => state.option.isLoading);
    let params = useParams();
    let audioElement = useRef(null)
    let cameraVideoRef = useRef(null)
    const [isTabActive, setIsTabActive] = useState(!document.hidden);

    let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
    const profileId = userInfo.profile

    const notify = (text, senderName, senderPP,link) => {
        audioElement?.current.play();
        toast(
            <Link className="text-decoration-none text-secondary" to={`${link}`}>
                <div style={{ color: "blue", fontWeight: "bold" }}>
                    <div className="row d-flex align-items-center">
                        <div className="col-3">
                            <img className="rounded-circle w-100" src={senderPP} alt="ICS" />
                        </div>
    
                        <div className="col-9">
                            {senderName && (<h3 className="text-success mb-0">{senderName}</h3>)}
                            <p className="text-small text-secondary text-muted mb-0">{text}</p>
                        </div>
                    </div>
                </div>
            </Link>
    
        );
    }
    useEffect(() => {
        socket.emit('fetchNotifications',profileId)
        socket.on('oldNotifications', data => {
            dispatch(addNotifications(data))
        })

        socket.on('newNotification', data => {
            dispatch(addNotification(data))
            notify(data.text,false,data.icon,data.link)
        })
        return () => {
            socket.off('oldNotifications')
            socket.off('newNotification')
        }
    }, [])

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabActive(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        socket.on('notification', (msg, senderName, senderPP) => {
            if (isTabActive == true) {
                notify(msg.message, senderName, senderPP,'/message' + msg.senderId)

            } else {
                if (Notification && Notification.permission === "granted") {
                    showNotification(msg);
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then(permission => {
                        if (permission === "granted") {
                            showNotification(msg);
                        }
                    });
                }
            }
        })

        socket.on('speak_message', (msg) => {
            speakText(msg)
        });

        return () => {
            socket.off('notification');
            socket.off('speak_message');
        };
    }, [socket, isTabActive])


    useEffect(() => {
        dispatch(setBodyHeight(window.innerHeight));
        api.post(`/profile`, { profile: profileId }).then(res => {
            dispatch(getPorfileReq())

            if (res.status === 200) {
                dispatch(setLogin({ isLoggedIn: true }))
                dispatch(getProfileSuccess(res.data));

            }

        }).catch(e => {
            dispatch(getProfileFailed(e))
        })

        if (window.location.pathname == '/') {
        } else {
            dispatch(setLoading(false))
        }

        setTimeout(() => {
            socket.emit('update_last_login', userInfo.user_id)
        }, 5000)

    }, [params])



    return (
        <Fragment>
            <audio ref={audioElement} src="https://programmerikram.com/wp-content/uploads/2025/02/fiverr_old_client_sound.mp3"></audio>

            <BR>

                {
                    isLoading && (<div id="site-loader">
                        <div className="loader-logo-container">
                            <img src="https://programmerikram.com/wp-content/uploads/2025/03/ics_logo-1.png" alt="ICS" />
                        </div>
                    </div>)}

                <Header cameraVideoRef={cameraVideoRef} />

                <div id="main-container" className={isLoading ? 'loading' : ''}>
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
                            <Route path="/message" element={<Message cameraVideoRef={cameraVideoRef} />}>
                                <Route path=":profile/" element={<Profile />}></Route>

                            </Route>
                            <Route path="/marketplace" element={<Marketplace />}> </Route>

                            <Route path="/groups" element={<Groups />}> </Route>
                            <Route path="/settings" element={Settings}></Route>

                        </Route>

                    </Routes>

                </div>
                <ToastContainer />
            </BR>
            <video style={{ display: 'none' }} ref={cameraVideoRef} autoPlay muted width="600" height="400" />
        </Fragment>

    )


}

export default Main