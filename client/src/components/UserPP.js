import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import socket from "../common/socket";
import api from "../api/api";
const default_pp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';


let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
let UserPP = (props) => {
    const params = useParams();
    const [imageExists, setImageExists] = useState(null);
    const [hasStory, setHasStory] = useState(props.hasStory || false);
    const [checkIsActive, setCheckIsActive] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const myProfileId = userInfo.profile

    var profileId = props.profile;
    var pp_url = props.profilePic;
    const checkImage = (url) => {
        const img = new Image();
        img.src = url;

        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
    };

    checkImage(props.profilePic)

    if (!imageExists) {
        pp_url = default_pp_src;
    }

    useEffect(() => {
        // socket.emit('is_active', { profileId: profileId, myId: myProfileId })
        setCheckIsActive(props.updateActive || 'no')
        if (props?.active == true) {
            return setIsActive(true)
        } else {
            return setIsActive(false)

        }
    }, [props])

    // useEffect(() => {
    //     if (checkIsActive == 'yes') {
    //         if (props.profile == undefined) return;
    //         socket.on('is_active', (isActive) => {
    //             setIsActive(isActive);
    //             alert(isActive)
    //         })
    //         return () => {
    //             socket.off('is_active');
    //         }
    //     }

    // }, [checkIsActive,props])


    return (
        <Fragment>
            <div className='user-profile-img-container'>
                {
                    isActive && <div className='active-icon active'></div>
                }

                <div className={`user-profile-img ${hasStory == true ? 'has-story' : ''}`}>
                    <Link to={`/${profileId}/`}>
                        <img src={pp_url} alt='Profile Picture'></img>
                    </Link>
                </div>
            </div>
        </Fragment>
    )
}

export default UserPP;