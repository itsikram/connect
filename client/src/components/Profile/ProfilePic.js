import React, {Fragment, useState} from "react";
import ModalContainer from "../modal/ModalContainer";
import AvatarEditor from "react-avatar-editor";
import api from "../../api/api";
import {useSelector} from "react-redux";

let ProfilePic = ({profileData}) => {

    let myProfileData = useSelector(state => state.profile)
    // handle profile pic upload

    const [isPPModal,setIsPPModal] = useState(false)
    const [profileImage,setProfileimage] = useState()

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


    let handlePPUploadSubmit = async(e) => {
        e.preventDefault()
        try {


            profilePicEditor.getImageScaledToCanvas().toBlob(async(Blob) => {
                let profilePicFile = new File([Blob],`${profileData._id}.png`,{
                    type: Blob.type,
                    lastModified: new Date().getTime()

                })
                console.log(profilePicFile,profileImage)
                let ppFormData = new FormData()
                ppFormData.append('profilePic',profilePicFile)
                ppFormData.append('type','profilePic')
                ppFormData.append('caption',e.target.caption.value)
                console.log(ppFormData)
                let res = await api.post('/profile/update/profilePic',ppFormData,{
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    }
                })
                if(res.status === 200) {
                    window.location.reload()
                }

                console.log(res.data)
            })



        } catch (error) {
            console.log(error)
        }



    }

    let ppInputChange = (e) => {

        setProfileimage(e.target.files[0])

    }

    let isAuth = myProfileData._id === profileData._id



    return(
        <Fragment>
            <div className="profile-pic">
                <div className="profilePic-container">
                    <img src={profileData.profilePic} alt="Ikram"/>

                </div>

                {
                    isAuth &&
                    <div onClick={PPuploadBtnClick} className="upload-profile-pic">
                        <i className="fa fa-camera-alt"></i>
                    </div>
                }



                <ModalContainer
                    title="Upload Profile Pics"
                    style={{width: "600px",top: "50%"}}
                    isOpen={isPPModal}
                    onRequestClose= {closePPModal}
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
                                    style={{margin: 'auto',marginBottom: '20px'}}
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