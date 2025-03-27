import React,{Fragment,useState,useEffect} from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
const default_pp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';

let UserPP = (props) => {

    const [imageExists, setImageExists] = useState(null);
    const [hasStory, setHasStory] = useState(false);

    useEffect(() => {
        if(props.hasStory == true) {
            return setHasStory(true)
        }
        // if(props.checkStory == 'no' && props.hasStory == false) {
        //     api.get('/profile/hasStory',{params: {
        //         profileId
        //     }}).then(res => {
        //         if(res.status == 200) {
        //             let storyStatus = res.data.hasStory
                    
        //             if(storyStatus == 'yes') {
        //                 setHasStory(true)
    
        //             }
        //             if(storyStatus == 'no') {
        //                 setHasStory(false)
        //             }
    
        //         }
        //     })
        // }        
    })
    var profileId = props.profile && props.profile;
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

      
    return (
        <Fragment>
            <div className='user-profile-img-container'>
                {
                    props.active && <div className='active-icon active'></div>
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