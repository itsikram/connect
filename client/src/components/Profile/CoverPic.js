import React, {Fragment, useState} from "react";
import ModalContainer from "../modal/ModalContainer";
import {useSelector} from "react-redux";
import api from "../../api/api";
import AvatarEditor from "react-avatar-editor";

let CoverPic = ({profileData}) => {

    let myProfileData = useSelector(state => state.profile)

    // Modal visibility functions
    let [isCpModal,setCpModal] = useState(false)
    let closeCpModal = () => {
        setCpModal(false)
    }
    let showCpModal = () => {
        setCpModal(true)
    }

    let hideCpModal = () => {
        setCpModal(false)
    }



    // cover photo upload handler
    let cpUploadSubmit = async(e) => {
        e.preventDefault()
        let cpFormData = new FormData()
        cpFormData.append('coverPic',coverImage)
        cpFormData.append('profile',profileData._id)


        try {

            let response = await api.post('/profile/update/coverPic',cpFormData,{headers: {
                    'content-type': 'multipart/form-data'
                }})
            console.log(response)

            if(response.status === 200) {
                setCpModal(false)
                window.location.reload()

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

    let [coverImage,setCoverImage] = useState(null)


    let onCpSelect = (e) => {
        setCoverImage(e.target.files[0])
    }
    let isAuth = myProfileData._id === profileData._id

    return(
        <Fragment>
            <div className="cover-photo-container">
                <img className="cover-photo" src={profileData.coverPic} alt="cover"/>

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
                    title={"Upload Cover Photo"}
                    style={{width: "500px", top: "20%"}}
                    isOpen={isCpModal}
                    onRequestClose={closeCpModal}
                    id = 'cp-upload-modal'
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
                                coverImage && <AvatarEditor ref={setEditorRef} image={URL.createObjectURL(coverImage)} scale={0.4} width="300px"style={{width: '100%',height:'auto'}} />
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