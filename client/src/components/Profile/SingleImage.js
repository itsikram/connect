import React from 'react';
import { Link } from 'react-router-dom';

const SingleImage = ({imageData}) => {

    return (
        <div className='image-item'>
            <Link to={`/post/${imageData._id}`}>
                <div className='profile-image-container'>
                    <img src={imageData.photos}  alt={imageData.caption || ''}/>
                </div>
            </Link>
            
        </div>
    );
}

export default SingleImage;
