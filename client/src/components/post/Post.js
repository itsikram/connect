import React, { Fragment, useState } from "react";
import $ from 'jquery'
import { useSelector } from 'react-redux'
import UserPP from "../UserPP";
import { Link } from "react-router-dom";
import serverConfig from '../../config.json'
import profileAi from '../../assets/images/ai.jpg'
import postImage from '../../assets/images/postImage1.jpg'
import Rlove from '../../assets/images/reacts/reactLove.svg';
import Rhaha from '../../assets/images/reacts/reactHaha.svg';
import Momemt from 'react-moment'
import api from "../../api/api";
import PostComment from "./PostComment";

const Rlike = 'https://programmerikram.com/wp-content/uploads/2025/03/like-icon.svg';

const default_pp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';


let Post = (props) => {
    let post = props.data || {}
    let myProfile = useSelector(state => state.profile)
    let myProfileId = myProfile._id;
    let postAuthorProfileId = post.author._id
    let isAuth = myProfileId === postAuthorProfileId
    let [totalLikes, setTotalLikes] = useState(post.reacts.length)

    const [imageExists, setImageExists] = useState(null);
    const [thumbExists, setThumbExists] = useState(null);

    var pp_url = props.profilePic;
    const checkImage = (url) => {
        const img = new Image();
        img.src = url;

        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
    };

    let postPhoto = post.photos


    const checkThumbImage = (url) => {
        const img = new Image();
        img.src = url;

        img.onload = () => setThumbExists(true);
        img.onerror = () => setThumbExists(false);
    }; 
    
    checkThumbImage(postPhoto)


    
    checkImage(pp_url);

    if(!imageExists) {
        pp_url = default_pp_src;
    }

    let type = post.type || 'post'
    let isLiked = (post, profile) => {
        let isLiked = false;
        post.reacts.map(react => {
            //console.log(react.profile,profile)
            if (react.profile === profile) {
                isLiked = true
            } else {
                isLiked = false
            }
        })
        return isLiked
    }


    let hideThisPost = (e) => {
        let target = e.currentTarget;
        $(target).parents('.nf-post').hide();
    }

    let likeOnClick = async (e) => {

        let target = e.currentTarget;
        if ($(target).hasClass('liked')) {
            $(target).find('.icon i').removeClass('fas')
            $(target).find('.icon i').addClass('far')
            let res = await api.post('/react/removeReact', { post: post._id })

            if (res.status === 200) {
                setTotalLikes(state => state - 1)

                $(target).removeClass('liked')
            }

        } else {
            $(target).find('.icon i').removeClass('far')
            $(target).find('.icon i').addClass('fas')

            let res = await api.post('/react/addReact', { type: 'like', post: post._id })
            if (res.status === 200) {
                $(target).addClass('liked')
                setTotalLikes(state => state + 1)
            }
        }

    }
    let likeMouseOver = e => {

    }
    let commentOnClick = (e) => {

        let target = e.currentTarget;

        $(target).parents('.footer').find('.field-comment-text').focus();


    }
    let shareOnClick = (e) => {

    }

    let authProfilePicture = useSelector(state => state.profile.profilePic)
    let authProfileId = useSelector(state => state.profile._id)

    let postAuthorPP = `${post.author.profilePic}`

    return (
        <div className={`nf-post ${type}`}>
            <div className="header">
                {
                    type === 'profilePic' &&
                    <div className="reason">
                        <span className="d-none">
                            <b>A bitch</b> commented.
                        </span>

                        <span>
                            Updated Profile Picture
                        </span>
                    </div>
                }
                <div className="author-info">
                    <div className="left">
                        <div className="author-pp">
                            <UserPP profilePic={postAuthorPP} profile={authProfileId} active={true}></UserPP>
                        </div>
                        <div className="post-nd-container">
                            <Link to={'/' + post.author._id}>
                                <h4 className="author-name">
                                    {post.author.user.firstName + ' ' + post.author.user.surname}
                                </h4>
                            </Link>
                            <span className="post-time">
                                <Momemt fromNow >{post.createdAt}</Momemt>
                            </span>
                        </div>

                    </div>
                    <div className="right">
                        <button className="post-three-dot"><i className="far fa-ellipsis-h"></i></button>
                        <button onClick={hideThisPost.bind(this)} className="post-close"> <i className="far fa-times"></i></button>
                    </div>
                </div>

            </div>
            <div className="body">
                <p className="caption">
                    {post.caption}
                </p>
                {
                    thumbExists &&
                    <div className="attachment">
                        <img src={postPhoto} alt="post" />
                    </div>

                    ||

                    <p className="fs-5 text-center text-danger">Post image not available</p>
                }

            </div>
            <div className="footer">
                <div className="react-count">
                    <div className="reacts">
                        <div className="react love d-none">
                            <img src={Rlove} alt="love" />
                        </div>
                        <div className="react like">
                            <img src={Rlike} alt="like" />
                        </div>
                        <div className="react haha d-none">
                            <img src={Rhaha} alt="haha" />
                        </div>
                        <span className="text">
                            {post.reacts && totalLikes} Likes
                        </span>
                    </div>
                    <div className="comment-share">
                        <div className="comment">
                            <div className="text">6K</div>
                            <div className="icon">
                                <i className="far fa-comment-alt"></i>
                            </div>

                        </div>
                        <div className="shares">
                            <div className="text">
                                877
                            </div>
                            <div className="icon">
                                <i className="fa fa-share"></i>
                            </div>

                        </div>
                    </div>


                </div>
                <div className="like-comment-share">
                    <div className="buttons-container">
                        <div onClick={likeOnClick} onMouseOver={likeMouseOver} className={`like button ${isLiked(post, myProfileId) ? 'liked' : ''}`}>
                            <span className="icon">
                                <i className="far fa-thumbs-up"></i>
                            </span>
                            <span className="text">Like</span>
                        </div>
                        <div onClick={commentOnClick} className="comment button">
                            <span className="icon">
                                <i className="far fa-comment-alt"></i>
                            </span>
                            <span className="text">Comment</span>
                        </div>
                        <div onClick={shareOnClick} className="share button">
                            <span className="icon">
                                <i className="far fa-share"></i>
                            </span>
                            <span className="text">Share</span>
                        </div>
                    </div>
                </div>
                <PostComment post={post} myProfile={myProfile} authProfile={authProfileId} authProfilePicture={authProfilePicture}></PostComment>


            </div>

        </div>
    )
}

export default Post;