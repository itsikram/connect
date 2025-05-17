import React from 'react';
import { Link } from 'react-router-dom';
import checkImgLoading from '../../utils/checkImgLoading';
import ImageSkleton from '../../skletons/ImageSkleton';
import { useState } from 'react';
import { useEffect } from 'react';
const SingleImage = ({ imageData }) => {
    let [isLoaded, setIsloaded] = useState(false)

    useEffect(() => {
        checkImgLoading(imageData.photos, setIsloaded)
    }, [])

    return (

        <>
            {
                isLoaded ?
                    <>
                        <div className='image-item'>
                        <Link to={`/post/${imageData._id}`}>
                            <div className='profile-image-container'>
                                <img src={imageData.photos} alt={imageData.caption || ''} />
                            </div>
                        </Link>
                    </div>
        </>

                    :

<>
    <ImageSkleton />
</>
            }

 </>
        
            



        
    );
}

export default SingleImage;
