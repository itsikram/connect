import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import ModalContainer from '../modal/ModalContainer'
import UserPP from "../UserPP";
import $, { post } from 'jquery'
import api from "../../api/api";

let CreatePost = ({setNewsFeed}) => {


    let profileData = useSelector(state => state.profile)
    let profileId = profileData._id


    // setting visibilty state for post modal container
    let [isPostModal, setPostModal] = useState(false)
    let [isUploading, setIsUploading] = useState(false)

    let handleCpFieldClick = (e) => {
        setPostModal(true)
    }
    let closeCreatePostModal = () => {
        setPostModal(false)
    }


    let [postData, setPostData] = useState({
        caption: '',
        attachments: null,
        urls: null
    })
    let [attachmentType, setAttachmentType] = useState(false)

    const [hasStory, setHasStory] = useState(false);

    useEffect(() => {
        api.get('/profile/hasStory', {
            params: {
                profileId
            }
        }).then(res => {
            if (res.status == 200) {
                let storyStatus = res.data.hasStory

                if (storyStatus == 'yes') {
                    setHasStory(true)

                }
                if (storyStatus == 'no') {
                    setHasStory(false)
                }

            }
        })

    }, [])


    const useMediaQuery = (query) => {
        const [matches, setMatches] = useState(window.matchMedia(query).matches);

        useEffect(() => {
            const media = window.matchMedia(query);
            const listener = (e) => setMatches(e.matches);
            media.addEventListener("change", listener);
            return () => media.removeEventListener("change", listener);
        }, [query]);

        return matches;
    };

    var isMobile = useMediaQuery("(max-width: 768px)");


    let profileName = profileData.user && profileData.user.firstName + ' ' + profileData.user.surname
    let textInputPlaceHoder = "What's On Your Mind " + profileName + " ?"


    // handling attachment button toggle

    let cpmAttachmentControllerToggle = (e) => {
        let thisButton = e.currentTarget
        $(thisButton).parents('.cpm-attachment').siblings('.cpm-attachment-control').slideToggle()

    }

    // handle caption field change 
    let handleCaptionField = (e) => {
        let value = e.target.value
        let name = e.target.name

        setPostData(state => {
            return {
                ...state,
                [name]: value,
            }
        })


    }

    // handle photo field update

    let handleAttachmentChange = useCallback((e) => {
        let currentTarget = e.currentTarget
        $(currentTarget).parents('.cpm-attachment-upload').slideUp()
        $(currentTarget).parents('.cpm-attachment-upload').siblings('.cpm-attachment-preview').slideDown()



        let name = e.target.name;
        let attachments = e.target.files[0];
        handleUploadAttachment(attachments.type,attachments)


    })

    // handling post submit 

    let preventDefault = (e) => {
        e.preventDefault()
    }

    let handleUploadAttachment = async (type,attachment) => {
        setIsUploading(true)
        try {

            let fileType = type.split('/')[0]
            setAttachmentType(fileType)

            switch (fileType) {
                
                case 'image':
                    let imageFormData = new FormData();

                    imageFormData.append('attachment',attachment);
                    imageFormData.append('type', 'image/png');

                    let uploadImageRes = await api.post('/upload/', imageFormData, {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    })
                    if (uploadImageRes.status == 200) {
                        setIsUploading(false)
                        var uploadedImageUrl = uploadImageRes.data.secure_url;
                        setPostData(state => {
                            return {
                                ...state,
                                urls: uploadedImageUrl,
                                type: fileType,

                            }
                        })
                    }

                    break;
                case 'video':
                    let watchUploadFormData = new FormData();
                    watchUploadFormData.append('attachment', attachment);
                    watchUploadFormData.append('type', 'video/mp4');

                    let uploadWatchRes = await api.post('/upload/video', watchUploadFormData, {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    })

                    if (uploadWatchRes.status == 200) {
                        var uploadedWatchUrl = uploadWatchRes.data.secure_url;
                        setIsUploading(false)
                        setPostData(state => {
                            return {
                                ...state,
                                type: fileType,
                                urls: uploadedWatchUrl
                            }
                        })

                    }
                    break;
            }





        } catch (error) {
            console.log(error)
        }



    }





    let handlePostSubmit = useCallback(async (e) => {
        e.preventDefault()
        try {

            switch (postData.type) {
                
                case 'image':
                    let postFormData = new FormData()
                    postFormData.append('caption', postData.caption)
                    postFormData.append('urls', postData.urls)

                    let res = await api.post('/post/create/', postFormData, {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    })

                    if (res.status === 200) {
                        setPostModal(false)
                    }

                    break;
                case 'video':

                let watchRes = await api.post('/watch/create', {caption: postData.caption, videoUrl: postData.urls}, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                })

                if (watchRes.status === 200) {
                    setPostModal(false)
                }
                    break;
            }





        } catch (error) {
            console.log(error)
        }

    })





    return (
        <Fragment>
            <div className="nf-create-post">
                <div className="top">
                    <div className="profile-pic">
                        <UserPP profilePic={profileData.profilePic} hasStory={hasStory} profile={profileData._id}></UserPP>
                    </div>
                    <div onClick={handleCpFieldClick} className="cp-field">
                        <input readOnly placeholder={textInputPlaceHoder} className="cp-input" />
                    </div>
                </div>
                <div className="bottom">
                    <ul onClick={handleCpFieldClick} className="button-container">
                        <li className="photo-button">
                            <div className="button-icon"></div>
                            <div className="button-text">Photo/video</div>

                        </li>
                        <li className="live-button">
                            <div className="button-icon"></div>
                            <div className="button-text">Live Video</div>

                        </li>
                    </ul>
                </div>
                <ModalContainer
                    isOpen={isPostModal}
                    id="create-post-modal"
                    onRequestClose={closeCreatePostModal}
                    title="Create A Post"
                    style={{ width: isMobile ? '95%' : '600px' }}
                >
                    <div className="modal-header">
                        <div className="modal-title">
                            Create a Post
                        </div>
                        <div onClick={closeCreatePostModal} className="modal-close-btn">
                            <i className="far fa-times"></i>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="cp-modal-container">
                            <div className="cpm-header">
                                <div className="cpm-profilePic">
                                    <UserPP profilePic={profileData.profilePic} hasStory={hasStory} profile={profileData._id}></UserPP>
                                </div>
                                <div className="cpm-username">
                                    <h3>{profileName}</h3>
                                </div>
                            </div>
                            <form className="cpm-form" onSubmit={preventDefault}>
                                <div className="cpm-form-text">
                                    <textarea name="caption" onChange={handleCaptionField} placeholder={textInputPlaceHoder} className="cpm-form-text-input" value={postData.caption}>

                                    </textarea>
                                </div>
                                <div className="cpm-attachment-control">
                                    <div className="cpm-attachment-preview">
                                        <img src={postData.urls && postData.urls} alt="attachment preview" />
                                    </div>
                                    <div className="cpm-attachment-upload">
                                        <div className="cpm-attachment-upload-overlay">
                                            <span className="plus-icon">

                                            </span>
                                            <span className="overlay-text">
                                                Add Photos/Videos
                                            </span>
                                        </div>
                                        <input onChange={handleAttachmentChange} name="photos_vidoes" type="file"></input>
                                    </div>
                                </div>
                                <div className="cpm-attachment">
                                    <span className="cpm-button-text">Add to your post</span>

                                    <div className="post-meta-buttons">
                                        <div onClick={cpmAttachmentControllerToggle} className="attachment-button-file">

                                        </div>
                                    </div>

                                </div>
                                <div className="cpm-submit-button">
                                    <button onClick={handlePostSubmit} className="button" disabled={isUploading && true} type="submit"> {isUploading ? 'Media Uploading....' : postData.urls ?  'Post Now' : 'Upload'} </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ModalContainer>
            </div>
        </Fragment>
    )
}

export default CreatePost;