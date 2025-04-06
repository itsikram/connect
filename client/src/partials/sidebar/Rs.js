import React, {Fragment, useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';

import api from '../../api/api';
import UserPP from '../../components/UserPP';


let RightSidebar = () => {
    let params = useParams();
    let navigate = useNavigate()
    let userJson = localStorage.getItem('user') ?localStorage.getItem('user') : '{}'
    let {profile} = JSON.parse(userJson)
    let myProfile = useSelector(state => state.profile)
    let [friendsData, setFriendsData] = useState([])

    useEffect(()=> {

        setFriendsData(myProfile.friends)

        // profile && api.get('/friend/getFriends',{
        //     params: {
        //         profile: profile
        //     }
            
        // }).then(res => {
        //     setFriendsData(res.data)
        // }).catch(e => {
        //     console.log(e)
        // })
    },[params])

    let redirectToMessage = (e) => {
        let profileId = e.currentTarget.dataset.profile
        navigate('/message/'+profileId)
    }

    return (
        <Fragment>
            <div id="right-sidebar" className='text-left'>
                <h3 className="rs-nav-title">Contacts</h3>
                <ul className="rs-nav-menu">
                    {
                        friendsData && friendsData.length > 1 && friendsData.map((data,key) => {
                             
                            return <li key={key}>
                            <div className='rs-nav-menu-item' data-profile={data._id} onClick={redirectToMessage.bind(this)}>
                                <div className='rs-profile-img-container'>
                                    <div className='active-icon'></div>
                                    <div className='rs-profile-img'>
                                        <UserPP profilePic={`${data.profilePic}`} profile={data._id}></UserPP>

                                    </div> 
                                </div>
                                
                                <div className='rs-text user-name'>{data.fullName ? data.fullName : data.user.firstName + ' '+data.user.surname}</div>
                            </div>
                        </li>
                        })
                    }

                </ul>
            </div>
        </Fragment>
    )
}

export default RightSidebar;