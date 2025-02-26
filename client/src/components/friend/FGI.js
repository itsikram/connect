import React, {Fragment} from 'react';
import { Link } from "react-router-dom";
import api from '../../api/api';
import $ from 'jquery'
import { useSelector } from 'react-redux';
import serverConfig from '../../config.json'


let FGI = (props) => {

    let myProfile = useSelector(state => state.profile)


    let type = props.type;
    let profilePic = serverConfig.SERVER_URL+'image/uploads/'+props.profilePic
    let fullName = props.fullName
    let profile = props.id ? props.id: ''

    let profileReqs = props.profileReqs ? props.profileReqs : false
    let isReq = profileReqs && profileReqs.includes(myProfile._id)


    // handle friend request button clicks
    let handleAcceptReq = async(e) => {
        let res = await api.post('/friend/reqAccept',{profile})


        if(res.status === 200) {
            $(e.target).text('Request Accepted')
            $(e.target).parents('.friend-grid-item').hide()
        }

    }

    let handleDeleteReq = async(e) => {

        try {
            let target = e.currentTarget
            let res = await api.post('/friend/reqDelete',{profile})

            $(target).parents('.friend-grid-item ').hide()

            
        } catch (error) {
            console.log(error)
        }




    }


    // handle friend suggetions button clicks 

    let handleAddFriend = async(e) => {
        try {
            let target = e.target
            let res = api.post('/friend/sendRequest',{profile})

            $(target).text('Request Sent')
                $(target).parents('.friend-grid-item').fadeOut()
            
        } catch (error) {
            console.log(error)
        }
    }

    let handleRomoveFriend = async(e) => {
        let target = e.currentTarget


        try {
            let res = api.post('/friend/removeRequest',{profile})

            $(target).siblings('.add-friend').text('Add Friend')
            !isReq && $(target).parents('.friend-grid-item').fadeOut()
            
            
        } catch (error) {
            console.log(error)
        }

    }



    if(type==="req") {
        
        return(
            <Fragment>
        <div className="friend-grid-item request">
                        <Link to={`/${profile}/`}>
                            <img className="profile-picture" alt ="profile" src={profilePic}></img>
                        </Link>
                        
                        <div className="grid-body">
                            <Link to={`/${profile}/`}>
                                <h5 className="profile-name">{fullName}</h5>
                            </Link>

                                <div onClick={handleAcceptReq} className="primary-button button">Confirm</div>
                                <div onClick={handleDeleteReq} className="button">Delete</div>
                            
                        </div>
                    </div>
        </Fragment>
        )
        
    }


    return (
        <Fragment>
            <div className="friend-grid-item suggest">
                        <Link to={`/${profile}/`}>
                            <img className="profile-picture" alt ="profile" src={profilePic}></img>
                        </Link>
                        
                        <div className="grid-body">
                            <Link to={`/${profile}/`}>
                                <h5 className="profile-name">{fullName}</h5>
                            </Link>

                                <div onClick={handleAddFriend} className="primary-button add-friend button">
                                    {
                                        isReq ? 'Request Sent':'Add Frind'
                                    }
                                </div>
                                <div onClick={handleRomoveFriend} className="button remove-friend">Remove</div>
                            
                        </div>
                    </div>
        </Fragment>
    )
}

export default FGI; 