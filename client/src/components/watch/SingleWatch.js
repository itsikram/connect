import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import PostContainer from './PostContainer';
import api from '../../api/api';
import $ from 'jquery'
import { useSelector } from 'react-redux'
import UserPP from "../UserPP";
import { Link } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import LeftSidebar from '../../partials/sidebar/Ls';
import Momemt from 'react-moment'
import PostComment from "./PostComment";
import SingleReactor from './SingleReactor';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS

const Rlike = 'https://programmerikram.com/wp-content/uploads/2025/03/like-icon.svg';
const Rlove = 'https://programmerikram.com/wp-content/uploads/2025/03/love-icon.svg';
const Rhaha = 'https://programmerikram.com/wp-content/uploads/2025/03/haha-icon.svg';
const default_pp_src = 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';


const SinglePost = () => {
    let { postId } = useParams()
    let [postData, setPostData] = useState(false)
    let loadData = async () => {

        let res = await api.get('post/single', { params: { postId } })
        if (res.status == 200) {
            setPostData(res.data)
        }
    }

    useEffect(() => {
        loadData()
    }, [postId])



    let myProfile = useSelector(state => state.profile)
    let myProfileId = myProfile._id;
    let postAuthorProfileId = postData && postData?.author._id
    let [totalReacts, setTotalReacts] = useState(postData && postData.reacts.length)
    let [totalShares, setTotalShares] = useState(postData && postData.shares.length)
    let [totalComments, setTotalComments] = useState(postData && postData.comments.length)
    let [reactType, setReactType] = useState(false);
    let [placedReacts, setPlacedReacts] = useState([]);
    const [imageExists, setImageExists] = useState(null);
    const [thumbExists, setThumbExists] = useState(null);


    var isAuth = myProfileId === postAuthorProfileId ? true : false;
    var pp_url = postData && postData?.author.profilePic
    const checkImage = (url) => {
        const img = new Image();
        img.src = url;

        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
    };



    useEffect(() => {
        let storedReacts = [];
        postData && postData.reacts.map(react => {
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

    let postPhoto = postData && postData.photos
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
    let type = postData && (postData.type || 'post')


    let hideThisPost = async (e) => {
        let target = e.currentTarget;

        if (isAuth) {
            confirmAlert({
                title: "Confirm Action",
                message: "Are you sure you want to delete this post?",
                buttons: [
                    {
                        label: "Yes",
                        onClick: async () => {
                            let deleteRes = await api.post('/post/delete', { postId: postData._id, authorId: postData.author._id })
                            if (deleteRes.status === 200) {
                                $(target).parents('.nf-post').css({
                                    'min-height': '0px',
                                    'padding': '10px'
                                });
                                $(target).parents('.nf-post').html('<p class="fs-6 mb-0 text-center text-danger">' + deleteRes.data.message + '</p>');
                            } else {
                                alert('Failed to delete post')
                            }
                        },
                    },
                    {
                        label: "No",
                        onClick: () => { },
                    },
                ],
            });

        } else {
            $(target).parents('.nf-post').hide();
        }
    }

    let removeReact = async (postType = 'post', target = null) => {
        setTotalReacts(state => state - 1)

        let res = await api.post('/react/removeReact', { id: postData._id, postType: 'post' })
        if (res.status === 200) {
            setTotalReacts(res.data.reacts.length)

            setReactType('')
            return true;
        } else {
            return false;
        }
    }
    let placeReact = async (reactType, postType = 'post', target = null) => {
        setTotalReacts(state => state + 1)

        let placeRes = await api.post('/react/addReact', { id: postData._id, postType, reactType })
        if (placeRes.status === 200) {
            setTotalReacts(placeRes.data.reacts.length)
            setPlacedReacts([...placedReacts, reactType])
            setReactType(reactType)

            return true;
        } else {
            return false;
        }

    }

    let likeBtnOnClick = async (e) => {
        let target = e.currentTarget;
        if ($(target).parent().hasClass('reacted')) {
            removeReact('post');
            $(target).parent().removeClass('reacted')

        } else {
            placeReact('like', 'post', target)
            $(target).parent().addClass('reacted')
        }

    }

    let likeOnClick = async (e) => {
        let target = e.currentTarget;
        $(target).parents('.post-react-container').css('visibility', 'hidden');
        if ($(target).hasClass('reacted')) {
            removeReact('post');
            $(target).removeClass('reacted')


        } else {
            placeReact('like', 'post', target)
            $(target).addClass('reacted')
            $(e.currentTarget).siblings().removeClass('reacted')
        }
        setTimeout(() => {
            $(target).parents('.post-react-container').css('visibility', 'visible');

        }, 500)


    }

    let loveOnClick = (e) => {
        let target = e.currentTarget;
        $(target).parents('.post-react-container').css('visibility', 'hidden');
        if ($(e.currentTarget).hasClass('reacted')) {
            removeReact('post');
            $(e.currentTarget).removeClass('reacted')

        } else {
            placeReact('love', 'post')
            $(e.currentTarget).siblings().removeClass('reacted')
            $(e.currentTarget).addClass('reacted')
        }
        setTimeout(() => {
            $(target).parents('.post-react-container').css('visibility', 'visible');

        }, 500)

    }

    let hahaOnClick = (e) => {
        let target = e.currentTarget;
        $(target).parents('.post-react-container').css('visibility', 'hidden');

        if ($(e.currentTarget).hasClass('reacted')) {
            removeReact();
            $(e.currentTarget).removeClass('reacted')
        } else {
            placeReact('haha', 'post', target)
            $(e.currentTarget).siblings().removeClass('reacted')

            $(e.currentTarget).addClass('reacted')
        }
        setTimeout(() => {
            $(target).parents('.post-react-container').css('visibility', 'visible');

        }, 500)
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

    let postAuthorPP = `${postData && postData?.author.profilePic}`
    let [match, setMatch] = useState(window.matchMedia('(max-width: 768px)').matches)

    useEffect(() => {
        // window width 
        window.matchMedia("(max-width:768px)").addEventListener('change', (e) => {
            setMatch(e.matches)
        })
    }, [])





    return (
        <div>

            <Container className='single-post-container' >
                <Row>


                    <Col md="6" className='br'>
                        <div id="post-container">
                            <div>
                                {postData && (
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
                                                        <UserPP profilePic={postAuthorPP} profile={postData.author._id} active={true}></UserPP>
                                                    </div>
                                                    <div className="post-nd-container">
                                                        <Link to={'/' + postData.author._id}>
                                                            <h4 className="author-name">
                                                                {postData.author.user.firstName + ' ' + postData.author.user.surname}
                                                            </h4>
                                                        </Link>
                                                        <span className="post-time">
                                                            <Momemt fromNow >{postData.createdAt}</Momemt>
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
                                                {postData.caption}
                                            </p>
                                            {
                                                (thumbExists &&
                                                    <div className="attachment">
                                                        <img src={postPhoto} alt="post" />

                                                    </div>)
                                            }

                                        </div>
                                        <div className="footer">
                                            <div className="react-count">
                                                <div className="reacts">


                                                    {
                                                        placedReacts.includes('like') ? <div className="react"> <img src={Rlike} alt="like" />  </div> : <span></span>

                                                    }
                                                    {
                                                        placedReacts.includes('love') ? <div className="react"> <img src={Rlove} alt="love" /> </div> : <span></span>

                                                    }
                                                    {
                                                        placedReacts.includes('haha') ? <div className="react"> <img src={Rhaha} alt="love" /> </div> : <span></span>

                                                    }


                                                    <span className="text">
                                                        {postData.reacts && totalReacts} {totalReacts > 1 ? 'Reacts' : 'React'}
                                                    </span>
                                                </div>
                                                <div className="comment-share">
                                                    <div className="comment">
                                                        <div className="text">{postData.comments && totalComments}

                                                        </div>
                                                        <div className="icon">
                                                            <i className="far fa-comment-alt"></i>
                                                        </div>

                                                    </div>
                                                    <div className="shares">
                                                        <div className="text">
                                                            {postData.shares && totalShares}
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

                                        </div>

                                    </div>
                                )}
                            </div>

                        </div>

                    </Col>

                    <Col md="3" className='br'>
                        <div className='sp-reacts-container'>
                            <h4 className='section-title'>Reactors {postData.reacts && `(${postData.reacts.length})`}</h4>

                            <ul className='sp-reacts'>

                                {postData.reacts && postData.reacts.map((item, index) => {

                                    return (

                                        <SingleReactor key={index} reactor={item}/>

                                    )

                                })}


                            </ul>
                        </div>
                    </Col>
                    <Col md="3">
                        <div className='sp-comments-container'>
                            <h4 className='section-title'>Comments { postData?.comments && `(${postData?.comments.length})`}</h4>
                            {postData?.comments && (<PostComment post={postData} commentState={setTotalComments} myProfile={myProfile} authProfile={authProfileId} authProfilePicture={authProfilePicture}></PostComment>)}
                        </div>


                    </Col>

                </Row>

            </Container>


        </div>
    );
}

export default SinglePost;
