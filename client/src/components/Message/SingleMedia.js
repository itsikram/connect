import React,{useState,useEffect,useCallback} from 'react';
import ImageSkleton from '../../skletons/post/ImageSkleton';
import checkImgLoading from '../../utils/checkImgLoading';
const SingleMedia = (props) => {

    let [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {{
        checkImgLoading(props.src, setIsLoaded);
    }},[props.src]);

    let handleMediaClick = useCallback((e) => {
        props.setIsLightbox(true)
        props.setImageIndex(props.index)
        // props.setIsLightbox(true)
        // props.setMediaIndex(props.index)
    })

    return (
        <>
            {!isLoaded && <div className='msg-media-item'><ImageSkleton count={5} /></div>}
            {isLoaded && <div onClick={handleMediaClick.bind(this)} className='msg-media-item'>
                <img src={props.src} className='w-100' alt="" />
            </div>}
        </>
    );
}

export default SingleMedia;
