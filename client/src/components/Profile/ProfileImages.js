import React, { useEffect,useState } from 'react';
import api from '../../api/api';
import { useParams,useLocation } from 'react-router-dom';
import SingleImage from './SingleImage';
const ProfileImages = () => {
    
    let [profileImages, setProfileImages] = useState([])
    let {profile} = useParams()
    let location = useLocation()
    useEffect(() => {
        api.get('profile/getImages',{
            params: {
                profileId: profile
            }
        }).then(res => {
            setProfileImages(res.data)
        })
    },[location])


    return (
        <div id='profile-images-container'>
            <div className='section-title'>
                Profile Images
            </div>
           <div className='image-items-container'>
                {
                    profileImages && profileImages.length > 1 ? 
                    profileImages.map((ImageData, index) => {

                        return <SingleImage imageData={ImageData} key={index} />
                    })

                    :

                    <p>No Images To Show</p>
                }
           </div>
        </div>
    );
}

export default ProfileImages;
