import React,{Fragment,useState,useEffect} from "react";
import { Link } from "react-router-dom";
import socket from "../common/socket";
import api from "../api/api";
const default_pp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';

let UserPP = (props) => {

    const [imageExists, setImageExists] = useState(null);
    const [hasStory, setHasStory] = useState(props.hasStory || false);
    const [isActive, setIsActive] = useState(false);

    var profileId = props.profile || false;
    var pp_url = props.profilePic;
    const checkImage = (url) => {
        const img = new Image();
        img.src = url;
    
        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
      };

      checkImage(props.profilePic)

      if(!imageExists) {
        pp_url = default_pp_src;
      }

    //   useEffect(() => {
    //     if (!profileId) return;

    //     socket.emit('is_active',profileId)

    //     socket.on('is_active', (isActive) => {
    //         setIsActive(isActive);
    //     })

    //     return () => {
    //         socket.off('is_active');
    //     }
    //   },[])

      
    return (
        <Fragment>
            <div className='user-profile-img-container'>
                {
                    isActive && <div className='active-icon active'></div>
                }
                
                <div className={`user-profile-img ${hasStory == true ? 'has-story': ''}`}>
                <Link to={`/${profileId}/`}>
                    <img src={pp_url} alt='Profile Picture'></img>
                    </Link>
                </div> 
             </div>
        </Fragment>
    )
}

export default UserPP;