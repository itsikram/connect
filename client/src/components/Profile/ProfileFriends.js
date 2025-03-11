import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { useSelector } from 'react-redux'
import PFI from './PFI';

const ProfileFriends = () => {

    let myProfile = useSelector(state => state.profile)
    let [friendsData,setFriendsData] = useState([])

    let params = useParams()


    useEffect(()=> {

        api.get('/friend/getFriends',{
            params: {
                profile: params.profile
            }

        }).then(res => {
            setFriendsData(res.data)
        }).catch(e => console.log(e))

    },[params])


    return (
        <Fragment>

            <div id='profile-friends-content'>
                <h4 className='section-title'>
                    Friends
                </h4>
                <div className='friend-items-container'>

                    {
                        friendsData.map((friend,key)=> {
                            if (friend._id !== myProfile._id) {
                                return  <PFI key={key} friend={friend}></PFI>

                            }
                            return;
                        })
                    }



                </div>

            </div>

        </Fragment>
    )
}

export default ProfileFriends;

