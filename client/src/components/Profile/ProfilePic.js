import React, { Fragment, useState, useEffect } from "react";
import ModalContainer from "../modal/ModalContainer";
import AvatarEditor from "react-avatar-editor";
import api from "../../api/api";
import { useSelector } from "react-redux";

const default_pp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';

let ProfilePic = ({ profileData }) => {

    let myProfileData = useSelector(state => state.profile)
    // handle profile pic upload

    const [isPPModal, setIsPPModal] = useState(false)
    const [isPPViewModal, setIsPPViewModal] = useState(false)
    const [isCPViewModal, setIsCPViewModal] = useState(false)
    const [profileImage, setProfileimage] = useState()

    const [imageExists, setImageExists] = useState(null);

    var profilePic = profileData.profilePic;
    var pp_url = profilePic;
    const checkImage = (url) => {
        const img = new Image();
        img.src = url;

        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
    };

    checkImage(profilePic)


    if (!imageExists) {
        pp_url = default_pp_src
    }
    // handle profile pic editors
    let profilePicEditor = ''

    const setEditorRef = (ed) => {
        profilePicEditor = ed;
    }


    let PPuploadBtnClick = (e) => {
        setIsPPModal(true)

    }

    let closePPModal = () => {
        setIsPPModal(false)
    }


    let PPContainerClick = () => {
        setIsPPViewModal(true)
    }

    let closePPViewModal = (e) => {
        setIsPPViewModal(false);
    }


    let handlePPUploadSubmit = async (e) => {
        e.preventDefault()
        try {


            profilePicEditor.getImageScaledToCanvas().toBlob(async (Blob) => {
                let profilePicFile = new File([Blob], `${profileData._id}.png`, {
                    type: Blob.type,
                    lastModified: new Date().getTime()

                })
                console.log(profilePicFile, profileImage)

                let ppFormData = new FormData();
                ppFormData.append('image', profilePicFile)

                let uplaodPPRes = await api.post('/upload',ppFormData, {
                    headers: {
                        'Content-Type':'multipart/form-data'
                    }
                })

                if(uplaodPPRes.status === 200) {

                    let profilePicUrl = uplaodPPRes.data.url;
                    console.log('pp url',profilePicUrl)
                    let PPostFormData = new FormData()
                    PPostFormData.append('profilePicUrl', profilePicUrl)
                    PPostFormData.append('type', 'profilePic')
                    PPostFormData.append('caption', e.target.caption.value)
                    let res = await api.post('/profile/update/profilePic', PPostFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    if (res.status === 200) {
                        window.location.reload()
                    }
    
                }

            })



        } catch (error) {
            console.log(error)
        }



    }

    let ppInputChange = (e) => {

        setProfileimage(e.target.files[0])

    }

    let isAuth = myProfileData._id === profileData._id
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

    var PPViewModalTitleStyles = {
        fontSize: isMobile ? '18px' : '30px',
    }

    return (
        <Fragment>
            <div className="profile-pic">
                <div className="profilePic-container"  onClick={PPContainerClick}>
                    <img src={pp_url} alt="Profile Pic" />

                </div>

                {
                    isAuth &&
                    <div onClick={PPuploadBtnClick} className="upload-profile-pic">
                        <i className="fa fa-camera-alt"></i>
                    </div>
                }



                <ModalContainer
                    title="View Profile Picture"
                    style={{ width: isMobile ? '95%' : "600px", top: "50%" }}
                    isOpen={isPPViewModal}
                    onRequestClose={closePPViewModal}
                    id="pp-view-modal"
                >

                    <div className="modal-header">
                        <div className="modal-title" style={PPViewModalTitleStyles}> View
                            Profile Picture</div>
                        <div onClick={closePPViewModal} className="modal-close-btn">
                            <i className="far fa-times"></i>
                        </div>

                    </div>
                    <div className="modal-body text-center">
                        <img src={profileData.profilePic} className="w-100" alt="Ikram" />

                    </div>
                </ModalContainer>

                <ModalContainer
                    title="Upload Profile Pics"
                    style={{ width: "600px", maxWidth: '95%', top: "50%" }}
                    isOpen={isPPModal}
                    onRequestClose={closePPModal}
                    id="pp-upload-modal"

                >

                    <div className="modal-header">
                        <div className="modal-title"> Upload
                            Profile Picture</div>
                        <div onClick={closePPModal} className="modal-close-btn">
                            <i className="far fa-times"></i>
                        </div>

                    </div>
                    <div className="modal-body">
                        <form onSubmit={handlePPUploadSubmit}>
                            <textarea placeholder="What's in your Mind?" name='caption' className="post-caption"></textarea>

                            {
                                profileImage && <AvatarEditor
                                    ref={setEditorRef}
                                    image={URL.createObjectURL(profileImage)}
                                    width={450}
                                    height={450}
                                    border={50}
                                    borderRadius={300}
                                    color={[0, 0, 0, 0.5]} // RGBA
                                    scale={1.1}
                                    rotate={0}
                                    style={{ margin: 'auto', marginBottom: '20px',maxWidth: '100%',height: '100%',width: '100%' }}
                                />
                            }
                            <input onChange={ppInputChange} name="profilePic" className="pp-upload-input" type='file'></input>
                            <button className="pp-upload-button" type="submit">Upload</button>
                        </form>
                    </div>
                </ModalContainer>



            </div>

        </Fragment>
    )
}
export default ProfilePic