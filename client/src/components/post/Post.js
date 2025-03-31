import React, { useState, useEffect } from "react";
import $ from 'jquery'
import { useSelector } from 'react-redux'
import UserPP from "../UserPP";
import { Link } from "react-router-dom";

import Momemt from 'react-moment'
import api from "../../api/api";
import PostComment from "./PostComment";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS

const Rlike = 'https://programmerikram.com/wp-content/uploads/2025/03/like-icon.svg';
const Rlove = 'https://programmerikram.com/wp-content/uploads/2025/03/love-icon.svg';
const Rhaha = 'https://programmerikram.com/wp-content/uploads/2025/03/haha-icon.svg';
const default_pp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';


let Post = (props) => {
    let post = props.data || {}
    let myProfile = useSelector(state => state.profile)
    let myProfileId = myProfile._id;
    let postAuthorProfileId = post.author._id
    let [totalReacts, setTotalReacts] = useState(post.reacts.length)
    let [totalShares, setTotalShares] = useState(post.shares.length)
    let [totalComments, setTotalComments] = useState(post.comments.length)
    let [reactType, setReactType] = useState(false);
    let [placedReacts, setPlacedReacts] = useState([]);
    const [imageExists, setImageExists] = useState(null);
    const [thumbExists, setThumbExists] = useState(null);


    var isAuth = myProfileId === postAuthorProfileId ? true : false;
    var pp_url = props.profilePic;
    const checkImage = (url) => {
        const img = new Image();
        img.src = url;

        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
    };

    

    useEffect(() => {
        let storedReacts = [];
        post.reacts.map(react => {
            if (react.profile) {

                switch (react.type) {
                    case 'like':

                        if (!storedReacts.includes('like')) {
                            storedReacts.push('like')
                        }

                        break;
                    case 'love':
                        if (!storedReacts.includes('love')) {
                            storedReacts.push('love')
                        }
                        break;
                    case 'haha':
                        if (!storedReacts.includes('haha')) {
                            storedReacts.push('haha')
                        }
                        break;
                }
                if (react.profile === myProfileId) {
                    setReactType(react.type)
                }
            }

        })

        setPlacedReacts(storedReacts);

    }, [])

    let postPhoto = post.photos
    const checkThumbImage = (url) => {
        const img = new Image();
        img.src = url;

        img.onload = () => setThumbExists(true);
        img.onerror = () => setThumbExists(false);
    };

    checkThumbImage(postPhoto)
    checkImage(pp_url);

    if (!imageExists) {
        pp_url = default_pp_src;
    }
    let type = post.type || 'post'


    let hideThisPost = async(e) => {
        let target = e.currentTarget;

        if(isAuth) {
            confirmAlert({
                title: "Confirm Action",
                message: "Are you sure you want to delete this post?",
                buttons: [
                  {
                    label: "Yes",
                    onClick: async() => {
                        let deleteRes = await api.post('/post/delete', { postId: post._id,authorId: post.author._id })
                        if (deleteRes.status === 200) {
                            $(target).parents('.nf-post').css({
                                'min-height' : '0px',
                                'padding' : '10px'
                        });
                            $(target).parents('.nf-post').html('<p class="fs-6 mb-0 text-center text-danger">'+deleteRes.data.message+'</p>');
                        } else {
                            alert('Failed to delete post')
                        }
                    },
                  },
                  {
                    label: "No",
                    onClick: () => {},
                  },
                ],
              });


        }else {
            $(target).parents('.nf-post').hide();
        }
    }

    let removeReact = async (target = null) => {
        setTotalReacts(state => state - 1)

        let res = await api.post('/react/removeReact', { post: post._id })
        if (res.status === 200) {
            setTotalReacts(res.data.reacts.length)
            
            setReactType('')
            return true;
        } else {
            return false;
        }
    }
    let placeReact = async (type, target = null) => {
        setTotalReacts(state => state + 1)

        let placeRes = await api.post('/react/addReact', { type, post: post._id })
        if (placeRes.status === 200) {
            setTotalReacts(placeRes.data.reacts.length)
            setPlacedReacts([...placedReacts,type])
            setReactType(type)

            return true;
        } else {
            return false;
        }

    }

    let likeBtnOnClick = async (e) => {
        let target = e.currentTarget;
        if ($(target).parent().hasClass('reacted')) {
            removeReact()
            $(target).parent().removeClass('reacted')

        } else {
            placeReact('like', target)
            $(target).parent().addClass('reacted')
        }

    }

    let likeOnClick = async (e) => {
        let target = e.currentTarget;
        $(target).parents('.post-react-container').css('visibility', 'hidden');
        if ($(target).hasClass('reacted')) {
            removeReact()
            $(target).removeClass('reacted')


        } else {
            placeReact('like', target)
            $(target).addClass('reacted')
            $(e.currentTarget).siblings().removeClass('reacted')
        }
        setTimeout(() => {
            $(target).parents('.post-react-container').css('visibility', 'visible');

        },500)


    }

    let loveOnClick = (e) => {
        let target = e.currentTarget;
        $(target).parents('.post-react-container').css('visibility', 'hidden');
        if ($(e.currentTarget).hasClass('reacted')) {
            removeReact();
            $(e.currentTarget).removeClass('reacted')

        } else {
            placeReact('love')
            $(e.currentTarget).siblings().removeClass('reacted')
            $(e.currentTarget).addClass('reacted')
        }
        setTimeout(() => {
            $(target).parents('.post-react-container').css('visibility', 'visible');

        },500)

    }

    let hahaOnClick = (e) => {
        let target = e.currentTarget;
        $(target).parents('.post-react-container').css('visibility', 'hidden');

        if ($(e.currentTarget).hasClass('reacted')) {
            removeReact();
            $(e.currentTarget).removeClass('reacted')
        } else {
            placeReact('haha')
            $(e.currentTarget).siblings().removeClass('reacted')

            $(e.currentTarget).addClass('reacted')
        }
        setTimeout(() => {
            $(target).parents('.post-react-container').css('visibility', 'visible');

        },500)
    }

    let likeMouseOver = e => {
        let target = e.currentTarget
        $(target).children('.post-react-container').css('visibility', 'visible');

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
                            <UserPP profilePic={postAuthorPP} profile={post.author._id} active={true}></UserPP>
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
                        {
                            isAuth && <button className="post-three-dot"><i className="far fa-ellipsis-h"></i></button>
                        }
                        
                        <button onClick={hideThisPost.bind(this)} className="post-close"> <i className="far fa-times"></i></button>
                    </div>
                </div>

            </div>
            <div className="body">
                <p className="caption">
                    {post.caption}
                </p>
                {
                    (thumbExists &&
                        <div className="attachment">
                            <img src={postPhoto} alt="post" />
                        </div>

                        ||

                        <p className="fs-5 text-center text-danger">Post image not available</p>)
                }

            </div>
            <div className="footer">
                <div className="react-count">
                    <div className="reacts">


                        {
                            placedReacts.includes('like') ? <div className="react"> <img src={Rlike} alt="like" />  </div>: <span></span>

                        }
                        {
                            placedReacts.includes('love') ? <div className="react"> <img src={Rlove} alt="love" /> </div>: <span></span>

                        }
                        {
                            placedReacts.includes('haha') ? <div className="react"> <img src={Rhaha} alt="love" /> </div>: <span></span>

                        }


                        <span className="text">
                            {post.reacts && totalReacts} {totalReacts > 1 ? 'Reacts' : 'React'}
                        </span>
                    </div>
                    <div className="comment-share">
                        <div className="comment">
                            <div className="text">{post.comments && totalComments}

                            </div>
                            <div className="icon">
                                <i className="far fa-comment-alt"></i>
                            </div>

                        </div>
                        <div className="shares">
                            <div className="text">
                                {post.shares && totalShares}
                            </div>
                            <div className="icon">
                                <i className="fa fa-share"></i>
                            </div>

                        </div>
                    </div>


                </div>
                <div className="like-comment-share">
                    <div className="buttons-container">
                        <div className={`react-buttons button ${reactType ? 'reacted' : ''}`}>
                            <div onClick={likeBtnOnClick} onMouseOver={likeMouseOver} className={`react-like ${reactType == true ? 'reacted' : ''}`}>
                                <span className="react-icon" datatype={reactType || ''}>
                                    {
                                        reactType == 'haha' ? <img src={Rhaha} alt="haha" /> : <span></span>
                                    }
                                    {
                                        reactType == 'love' ? <img src={Rlove} alt="love" /> : <span></span> 
                                    }
                                    {
                                        reactType == false || reactType == 'like' ? <img src={Rlike} alt="like" /> : <span></span> 
                                    }
                                </span>
                                <span className="text text-capitalize">{reactType ? reactType : 'like'}</span>
                            </div>
                            <div className="post-react-container">
                                <div className={`react react-like ${reactType == 'like' ? 'reacted' : ''}`} onClick={likeOnClick} id="postReactLike" title="Like">
                                    <img src={Rlike} alt="love" />
                                </div>
                                <div className={`react react-love ${reactType == 'love' ? 'reacted' : ''}`} onClick={loveOnClick} id="postReactLove" title="Love">
                                    <img src={Rlove} alt="love" />
                                </div>
                                <div className={`react react-haha ${reactType == 'haha' ? 'reacted' : ''}`} onClick={hahaOnClick} id="postReactHaha" title="Haha">
                                    <img src={Rhaha} alt="haha" />
                                </div>
                            </div>
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
                <PostComment post={post} commentState={setTotalComments} myProfile={myProfile} authProfile={authProfileId} authProfilePicture={authProfilePicture}></PostComment>


            </div>

        </div>
    )
}

export default Post;