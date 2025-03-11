import React,{useState,Fragment} from 'react';
import $ from 'jquery'
import UserPP from '../UserPP';
import api from '../../api/api';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

const PostComment = (props) => {
    let post = props.post || {}
    let authProfilePicture = props.authProfilePicture
    let authProfileId = props.authProfile;
    let myProfile = props.myProfile ? props.myProfile : {}


    // handle all comment state 

    let [allComments,setAllComments] = useState(post.comments.slice(-3))


    // handle add attachmenent to comment on click

    let clickCommentAttachBtn = async(e) => {
        let target = e.currentTarget
        $(target).children('input').trigger('click')
    }

    // handle comment attachment change

    let [commentData,setCommentData] = useState({
        body: null,
        attachment: null
    })

    let handleAttachChange = async(e) => {
        setCommentData(state => {
            return {
                ...state,
                attachment: e.target.files[0]
            }
        })
    }
    let handleCommentBodyChange = async(e) => {
        setCommentData(state => {
            return {
                ...state,
                body: e.target.value
            }
        })
    }

    let handleCommentKeyUp = async(e) => {
        e.preventDefault()
        if(e.keyCode === 13) {
            try {
                e.target.value = ''
                let commentFormData = new FormData()
                commentFormData.append('body',commentData.body)
                commentFormData.append('attachment',commentData.attachment)
                commentFormData.append('post',post._id)


                let res = await api.post('/comment/addComment',commentFormData)
                if(res.status === 200) {
                    let data = res.data
                    data.author = myProfile
                    let newComment = data
                    setAllComments(state => {
                        let oldComments = [...state].slice(-3)
                        
                        let cr = [
                            ...state,
                            ...[newComment]
                        ]
                        
                        console.log('cr',cr)
                        return cr;
                        
                    })
                    console.log(res.data)
                }
            } catch (error) {
                console.log(error)
            }

        
        }
    }



    return (
        <Fragment>
            <div className="comments">

                {
                    allComments.map((comment, key) => {
                         
                        return  <div key={key} className="comment-container">
                                    <div className="author-pp">
                                        <UserPP profilePic={comment.author.profilePic} profile={comment.author._id}></UserPP>
                                        </div>
                                    <div className="comment-info">
                                        <div className="comment-box">
                                                <div className="name-comment"> 
                                                    <div className="author-name">
                                                        <Link to={`/${comment.author._id}`}>
                                                            {comment.author.user.firstName + ' ' + comment.author.user.surname}
                                                        </Link>
                                                    </div>
                                                    <p className="comment-text">{comment.body}</p>
                                                </div>
                                                <div className="options-icon">
                                                    <i className="far fa-ellipsis-h"></i>
                                                </div>
                                        </div>

                                        <div className="comment-react">
                                                <div className="like button">Like</div>
                                                <div className="reply button">Reply</div>
                                                <div className="comment-time"><Moment fromNow>{comment.createdAt}</Moment></div>
                                        </div>
                                    </div>
                                </div>
                    })
                }

                                {
                                    post.comments.length > allComments.length && <div className="more-comment-button"> View more comments</div>

                                }                                                
                                            </div>
                                            <div className="new-comment">
                                                <div className="user-pp">
                                                    <UserPP profilePic={authProfilePicture} profile={authProfileId}></UserPP>
                                                </div>
                                                <div className="comment-field">
                                                    <input onKeyUp={handleCommentKeyUp} onChange={handleCommentBodyChange} className="field-comment-text" type="text" placeholder="Write a Public Comment"/>
                                                    <div onClick={clickCommentAttachBtn} className="comment-attachment">
                                                        <input onChange={handleAttachChange} className="attachment" type="file"/>
                                                        <span className="icon">
                                                            <i className="far fa-camera"></i>
                                                        </span>

                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <div className="comment-attachment-preview">
                                                        {
                                                            commentData.attachment &&
                                                            <img alt='comment attachment' src={URL.createObjectURL(commentData.attachment)}></img> 
                                                        }
                                            </div>
        </Fragment>
    );
}

export default PostComment;
