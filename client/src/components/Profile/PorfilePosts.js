import React, {Fragment, useCallback, useEffect,useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CreatePost from "../post/CreatePost";
import Post from "../post/Post";
import ProfileDetails from "./ProfileDetails";
import api from "../../api/api";
import $ from 'jquery'
import PostSkeleton from "../../skletons/post/PostSkeleton";


let PorfilePosts = () => {
    let {profile} = useParams()
    let myProfileData = useSelector(state => state.profile) || {}
    let isAuth = myProfileData._id === profile
    const [posts,setPosts] = useState([])
    let navigate = useNavigate()

    useEffect(() => {
        api.get('/post/myPosts',{
            params: {
                profile
            }
        }).then(res => {
            if(res.status === 200) {
                setPosts(res.data)
            }
        })
    },[profile])



    // handle edit bio functions
    const [bio,setBio] = useState(myProfileData.bio)
    let updateBioData = (e) => {
        setBio(e.target.value)
    }
    let handleEditBio = async(e)=> {
        try {
            let target = e.currentTarget

            if($(target).hasClass('edit-button')){
                $(target).siblings('.bio-text').hide()
                $(target).siblings('.bio-text-textarea').show()
                $(target).siblings('.bio-text-textarea').val(bio || myProfileData.bio)
                $(target).removeClass('edit-button')
                $(target).addClass('save-button')
                $(target).text('Save Bio')
            }else {
                let res = await api.post('/profile/update/bio',{bio})
                $(target).text('Edit Bio')
                $(target).siblings('.bio-text').show()
                $(target).removeClass('save-button')
                $(target).siblings('.bio-text-textarea').hide()
                $(target).addClass('edit-button')

            }


        }catch (e){
            console.log(e)
        }
    }

    let handleEditProfileDetails = useCallback(e => {
        navigate('/settings/')
    }) 

    

    return(
        <Fragment>
            <div id="profile-post-content">
                <div className="intro">
                    <h4 className="section-title">Intro</h4>
                    <div className="profile-bio">
                        <p className="bio-text">
                            {bio || myProfileData.bio}
                        </p>
                        <textarea onChange={updateBioData} value={bio} className={"bio-text-textarea"}>
                            
                        </textarea>
                        {
                            isAuth &&  <div onClick={handleEditBio} className="edit-button"> Edit bio</div>
                        }
                       
                    </div>
                    <div className="details">
                        <ProfileDetails/>
                        {
                            isAuth &&   <div onClick={handleEditProfileDetails} className="edit-button"> Edit Details</div>

                        }
                    </div>
                </div>
                <div className="posts-container">
                    {
                        isAuth && <CreatePost setNewsFeed={setPosts}></CreatePost>
                    }
                    
                    {posts.length > 0 ? posts.map((data,index) => {
                        return <Post key={index} myProfile={myProfileData} data={data}></Post>
                    })
                    :
                    <PostSkeleton  count={3}/>
                
                }
                    
                </div>
            </div>
        </Fragment>
    )
}

export default PorfilePosts;