import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import checkImgLoading from "../utils/checkImgLoading";

const default_pp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';


let userInfo = JSON.parse((localStorage.getItem('user') || '{}'))
let UserPP = (props) => {



    const [imageExists, setImageExists] = useState(null);
    const [hasStory, setHasStory] = useState(props.hasStory || false);
    const [checkIsActive, setCheckIsActive] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [profilePic, setProfilePic] = useState(props.profilePic);
    const [ppLoaded, setPPLoaded] = useState(false);
    const myProfileId = userInfo.profile

    var profileId = props.profile;


    useEffect(() => {
        // socket.emit('is_active', { profileId: profileId, myId: myProfileId })
        setCheckIsActive(props.updateActive || 'no')
        setProfilePic(props.profilePic)
        checkImgLoading(props.profilePic,setPPLoaded)

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
                        {
                            ppLoaded ? <img src={profilePic} alt='Profile Picture'></img> : <> <img src={profilePic} alt='Profile Picture'></img> </>
                        }
                        
                    </Link>
                </div>
            </div>
        </Fragment>
    )
}

export default UserPP;