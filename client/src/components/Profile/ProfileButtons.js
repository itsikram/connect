import React,{Fragment,useState} from 'react';
import api from '../../api/api';
import $ from 'jquery'
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const ProfileButtons = (props) => {
    const navigate = useNavigate();
    let myProfile = useSelector(state => state.profile)
    let profileData = props.profileData
    let isAuth = props.isAuth
    let isFriend = props.isFriend
    let isReqSent = profileData.friendReqs && profileData.friendReqs.includes(myProfile._id)
    let isReqRecived = myProfile.friendReqs && myProfile.friendReqs.includes(profileData._id)
    let isReq = isReqSent || isReqRecived


        // handle add friend button click 
        let clickAddFriendBtn = (e) =>{
            let target  = e.currentTarget
            
            if(!$(target).hasClass('sent')){
                api.post('/friend/sendRequest/',{
                    profile: profileData._id
                }).then(res => {
                    $(target).children('span').text('Request Sent')
                    $(target).addClass('sent')
        
                }).catch(e => {
                    console.log(e)
                })
            }

    
        }
    
        // handle click friend button 
        let clickFriendBtn = (e) => {

            let target = e.currentTarget
            $(target).children('.friend-options-menu').toggleClass('hide')
    
        }
    
    
        // handle click message button 
        let clickMessageBtn  = (e) => {
            navigate(`/message/${profileData._id}`)
        }

        // handle cencel friend request
        let handleCencleReq = async(e) => {
            try {

                let target = e.currentTarget

                if(!$(target).hasClass('removed')){
                    let res = await api.post('/friend/removeRequest',{profile:profileData._id})
                    $(target).addClass('removed')
                    $(target).children('span').text('Request Cenceled')
                }


                
            } catch (error) {
                console.log(error)
            }
        }

        // handle confirm friend request
        let handleConfirmReq = async(e) => {
            try {
                let target = e.currentTarget
                if(!$(target).hasClass('accepted')){

                    let res = await api.post('/friend/reqAccept',{profile:profileData._id})
                    $(target).children('span').text('Accepted')
                    $(target).addClass('Friend Accepted')

                }

                
            } catch (error) {
                console.log(error)
            }
        }

        // handle click unfrind button

        let clickUnFrndBtn = async(e) => {
            try {
                let target = e.currentTarget
                
                let res = api.post('/friend/removeFriend',{profile: profileData._id})

                console.log(res.data)

                $(target).parents('.friend').hide()
                
            } catch (error) {
                console.log(error)
            }
        }



    return (
        <Fragment>
            {
                                isAuth ?                             
                                <div className="profile-buttons">
                                    <div className="highligh-btn button add-story">
                                        <i className="fas fa-plus-circle"></i>
                                        <span>
                                            Add to story
                                        </span>
                                    </div>
                                    <div className="normal-btn button edit-profile">
                                    <i className="fas fa-pen"></i>
                                        <span>
                                            Edit Profile
                                        </span>
                                    </div>
                                </div>
                                :
                                isFriend ?
                                        <div className="profile-buttons">
                                            <div onClick={clickFriendBtn} className="button normal-btn  friend">
                                                <i className="fas fa-user-check"></i>
                                                <span>
                                                    Friend
                                                </span>
                                                <div className='friend-options-menu hide'>
                                                    <div onClick={clickUnFrndBtn} className='friend-options-menu-item'>
                                                        <div className='menu-item-icon'>
                                                        <i className="fas fa-user-times"></i>
                                                        </div>
                                                        <div className='menu-item-text'>Remove Friend</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={clickMessageBtn} className="highligh-btn button message-button">
                                            <i className="fas fa-comment-dots"></i>
                                                <span>
                                                    Message
                                                </span>
                                            </div>
                                        </div>
                                        : 
                                        !isReq ?
                                    <div className="profile-buttons">
                                        <div onClick={clickAddFriendBtn} className="highligh-btn button add-friend">
                                            <i className="fas fa-user-check"></i>
                                            <span>
                                                Add Friend
                                            </span>
                                        </div>
                                        <div onClick={clickMessageBtn} className="normal-btn button message-button">
                                        <i className="fas fa-comment-dots"></i>
                                            <span>
                                                Message
                                            </span>
                                        </div>
                                    </div>

                                        : isReqSent ?


                                    <div className="profile-buttons">
                                        <div onClick={handleCencleReq} className="normal-btn button cencel-friend">
                                            <i className="fas fa-user-check"></i>
                                            <span>
                                                Cencel Request
                                            </span>
                                        </div>
                                        <div onClick={clickMessageBtn} className="highligh-btn button message-button">
                                        <i className="fas fa-comment-dots"></i>
                                            <span>
                                                Message
                                            </span>
                                        </div>
                                    </div>
                                    :

                                    <div className="profile-buttons">
                                        <div onClick={handleConfirmReq} className="highligh-btn button confirm-friend">
                                            <i className="fas fa-user-check"></i>
                                            <span>
                                                Confirm Request
                                            </span>
                                        </div>
                                        <div onClick={clickMessageBtn} className="normal-btn button message-button">
                                        <i className="fas fa-comment-dots"></i>
                                            <span>
                                                Message
                                            </span>
                                        </div>
                                    </div>

                            }
        </Fragment>
    );
}

export default ProfileButtons;
