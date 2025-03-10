import React,{Fragment,useEffect} from "react";

import {BrowserRouter as BR, Routes,Route} from 'react-router-dom'

import Header from '../partials/header/Header';
import Home from "./Home";
import Profile from "./Profile";
import Friends from "./Friends";
import Watch from "./Watch";
import Marketplace from './Marketplace'
import Groups from './Groups'
import Message from "./Message";

import ProfileAbout from "../components/Profile/ProfileAbout";
import PorfilePosts from "../components/Profile/PorfilePosts";
import ProfileFriends from "../components/Profile/ProfileFriends";

import FriendRequests from "../components/friend/FriendRequests";
import FriendSuggest from "../components/friend/FriendSuggest"
import FriendHome from "../components/friend/FriendHome";
import { useDispatch,useSelector } from "react-redux";

import { logOut } from "../store/authReducer";
import api from "../api/api";
import {getPorfileReq,getProfileFailed,getProfileSuccess} from '../services/actions/profileActions'
import { setLogin } from "../services/actions/authActions";
import Settings from "./Settings";
import ProfileIkramul from "./ProfileIkramul";





const Main = () => {



    let dispatch = useDispatch()
    let profile = useSelector(state => state.profile)




    useEffect(()=> {

        let userInfo = JSON.parse((localStorage.getItem('user')||'{}'))
        const profileId = userInfo.profile

        api.post(`/profile`,{profile: profileId}).then(res => {
            dispatch(getPorfileReq())

            if(res.status === 200) {
                dispatch(setLogin({isLoggedIn: true}))
                dispatch(getProfileSuccess(res.data));

                
            }

        }).catch(e => {
            dispatch(getProfileFailed(e))
        })







    },[])




    let logOuts = () => {
        localStorage.removeItem('user')
        dispatch(logOut())
    }
    

    return (
        <Fragment>
            <BR>
            
                <Header/>
                
                     <div id="main-container">
                        <Routes>
                            <Route path="/">
                                <Route index element={<Home/>}></Route>

                                <Route path="/ikramul-islam/" element={<ProfileIkramul/>}></Route>


                                <Route path="/:profile/" element={<Profile/>}>
                                    <Route index element={<PorfilePosts/>}/>
                                    <Route path="about" element={<ProfileAbout/>}/>
                                    <Route path="friends" element={<ProfileFriends/>}></Route>
                                </Route>
                                <Route path="/friends/" element={<Friends/>}> 
                                    <Route index element={<FriendHome/>}></Route>
                                    <Route path="requests" element={<FriendRequests/>}></Route>
                                    <Route path="suggestions" element={<FriendSuggest/>}></Route>

                                </Route>FriendHome
                                <Route path="/watch" element={<Watch/>}> </Route>
                                <Route path="/message" element={<Message/>}>
                                    <Route path=":profile/" element={<Profile/>}></Route>

                                </Route>
                                <Route path="/marketplace" element={<Marketplace/>}> </Route>

                                <Route path="/groups" element={<Groups/>}> </Route>
                                <Route path="/settings" element={Settings}></Route>

                            </Route>

                        </Routes>
                    
                     </div>
                
            </BR>
        </Fragment>
        
    )

   
}

export default Main