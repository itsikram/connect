import React, { Fragment, useState, useEffect } from "react";
import ModalContainer from "../modal/ModalContainer";
import { useSelector } from "react-redux";
import api from "../../api/api";
import AvatarEditor from "react-avatar-editor";
const default_cp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-cover.png';

let CoverPic = ({ profileData }) => {

    let myProfileData = useSelector(state => state.profile)

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
    // Modal visibility functions
    let [isCpModal, setCpModal] = useState(false)
    let [isCPViewModal, setisCPViewModal] = useState(false)
    let closeCpModal = () => {
        setCpModal(false)
    }
    let showCpModal = () => {
        setCpModal(true)
    }

    let hideCpModal = () => {
        setCpModal(false)
    }

    let openCPViewModal = () => {
        setisCPViewModal(true)
    }

    let closeCPViewModal = () => {
        setisCPViewModal(false)
    }


    var CPViewModalTitleStyles = {
        fontSize: isMobile ? '18px' : '30px',
    }

    const [cPExists, setCPExists] = useState(null);

    var cp_url = profileData.coverPic;
    const checkImage = (url) => {
        const img = new Image();
        img.src = url;

        img.onload = () => setCPExists(true);
        img.onerror = () => setCPExists(false);
    };

    checkImage(cp_url)


    if (!cPExists) {
        cp_url = default_cp_src
    }
    // cover photo upload handler
    let cpUploadSubmit = async (e) => {
        e.preventDefault()



        try {

            let coverPicFromData = new FormData();
            coverPicFromData.append('image', coverImage)

            let uploadCoverPicRes = await api.post('/upload',coverPicFromData,{
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })

            if(uploadCoverPicRes.status === 200) {
                let coverPicUrl = uploadCoverPicRes.data.url;
                if(coverPicUrl) {

                    let cpFormData = new FormData()
                    cpFormData.append('coverPicUrl', coverPicUrl)
                    cpFormData.append('profile', profileData._id)

                    let response = await api.post('/profile/update/coverPic', cpFormData, {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    })
        
                    if (response.status === 200) {
                        setCpModal(false)
                        window.location.reload()
        
                    }
                }

            }



        } catch (error) {
            console.log(error)
        }


    }

    //state editor ref

    let coverPicEditor = ''
    let setEditorRef = (ed) => {
        coverPicEditor = ed
    }




    //state for cover photo

    let [coverImage, setCoverImage] = useState(null)


    let onCpSelect = (e) => {
        setCoverImage(e.target.files[0])
    }
    let isAuth = myProfileData._id === profileData._id

    return (
        <Fragment>
            <div className="cover-photo-container">
                <img onClick={openCPViewModal} className="cover-photo" src={cp_url} alt="cover" />

                {
                    isAuth &&
                    <div className="upload-cover-photo" onClick={showCpModal}>
                        <i className="fa fa-camera-alt"></i>
                        <span>
                            Upload Cover Photo
                        </span>

                    </div>
                }

                <ModalContainer
                    title="View Cover Photo"
                    style={{ width: isMobile ? '95%' : "600px", top: "50%" }}
                    isOpen={isCPViewModal}
                    onRequestClose={closeCPViewModal}
                    id="cp-view-modal"
                >

                    <div className="modal-header">
                        <div className="modal-title" style={CPViewModalTitleStyles}> View
                            Profile Picture</div>
                        <div onClick={closeCPViewModal} className="modal-close-btn">
                            <i className="far fa-times"></i>
                        </div>

                    </div>
                    <div className="modal-body text-center">
                        <img src={cp_url} className="w-100" alt="Ikram" />

                    </div>
                </ModalContainer>

                <ModalContainer
                    title={"Upload Cover Photo"}
                    style={{ width: "500px", top: "20%" }}
                    isOpen={isCpModal}
                    onRequestClose={closeCpModal}
                    id='cp-upload-modal'
                >

                    <div className="modal-header">
                        <div className="modal-title">
                            Upload Cover Photo
                        </div>
                        <div onClick={hideCpModal} className="modal-close-btn">
                            <i className="far fa-times"></i>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="modal-upload-preview">
                        </div>
                        <form onSubmit={cpUploadSubmit}>
                            {
                                coverImage && <AvatarEditor ref={setEditorRef} image={URL.createObjectURL(coverImage)} scale={0.4} width="300px" style={{ width: '100%', height: 'auto' }} />
                            }

                            <input name="profilePic" className="cp-upload-input" onChange={onCpSelect} type="file"></input>
                            <button type="submit" className="cp-upload-button">Upload</button>
                        </form>

                    </div>

                </ModalContainer>

            </div>

        </Fragment>
    )
}


export default CoverPic