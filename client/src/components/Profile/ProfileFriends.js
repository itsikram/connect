import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { useSelector } from 'react-redux'
import PFI from './PFI';

const ProfileFriends = () => {

    let myProfile = useSelector(state => state.profile)
    let [friendsData,setFriendsData] = useState([])
    let [isAuth, setIsAuth] = useState(false)

    let params = useParams()

    useEffect(()=> {
        let isAuth = params.profile === myProfile._id ? true : false
        setIsAuth(isAuth)
        if(isAuth) {
            return setFriendsData(myProfile.friends)

        }

        api.get('/friend/getFriends',{
            params: {
                profile: params.profile
            }

        }).then(res => {
            setFriendsData(res.data)
        }).catch(e => console.log(e))

    },[params,myProfile])


    return (
        <Fragment>

            <div id='profile-friends-content'>
                <h4 className='section-title'>
                    Friends
                </h4>
                <div className='friend-items-container'>

                    {
                        friendsData.map((friend,index)=> {
                            if (!isAuth) {
                                return  <PFI key={index} friend={friend}></PFI>

                            }else if(friend._id !== myProfile._id) {
                                return  <PFI key={index} friend={friend}></PFI>

                            }
                        })
                    }



                </div>

            </div>

        </Fragment>
    )
}

export default ProfileFriends;

