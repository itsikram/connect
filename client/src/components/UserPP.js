import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import checkImgLoading from "../utils/checkImgLoading";

const default_pp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';


let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
let UserPP = (props) => {
    const [hasStory, setHasStory] = useState(props.hasStory || false);
    const [checkIsActive, setCheckIsActive] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [profilePic, setProfilePic] = useState(props.profilePic || default_pp_src);
    const [ppLoaded, setPPLoaded] = useState(false);

    var profileId = props.profile;


    useEffect(() => {
        // socket.emit('is_active', { profileId: profileId, myId: myProfileId })
        setCheckIsActive(props.updateActive || 'no')
        checkImgLoading(props.profilePic, setPPLoaded)

        if (props?.active == true) {
            return setIsActive(true)
        } else {
            return setIsActive(false)
        }

    }, [props])

    useEffect(() => {

        if (ppLoaded) {
            setProfilePic(props.profilePic)
        }

    }, [ppLoaded])


    return (
        <Fragment>
            <div className='user-profile-img-container'>
                {
                    isActive && <div className='active-icon active'></div>
                }

                <div className={`user-profile-img ${hasStory == true ? 'has-story' : ''}`}>
                    {
                        ppLoaded ?
                            <>
                                <Link to={`/${profileId || ''}`}>
                                    <img src={props.profilePic} alt='' />

                                </Link>
                            </>
                            :
                            <>
                                <Link to={`/${profileId || ''}`}> <img src={props.profilePic} alt='' /></Link>
                            </>
                    }
                </div>
            </div>
        </Fragment>
    )
}

export default UserPP;