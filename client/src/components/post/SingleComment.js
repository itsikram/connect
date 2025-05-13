import React, { useState, useEffect,useMemo } from "react";
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import SingleReply from "./singleReply";
import UserPP from "../UserPP";
import $ from 'jquery'
import api from '../../api/api';


const SingleComment = ({ comment, postData, myProfile }) => {

    let myId = myProfile._id
    let [totalComment, setTotalComment] = useState(0)
    let [isReacted, setIsReacted] = useState(false);
    let [isReply, setIsReply] = useState(false)
    let [replies, setReplies] = useState(comment?.replies)
    const post = postData // useMemo((postData) => postData,[])


    useEffect(() => {
        setTotalComment(comment.reacts.length || 0)
        setIsReacted(comment.reacts.includes(myId))
    }, [comment])

    let handleCommentReplyBtnClick = async (e) => {
        setIsReply(!isReply)
    }

    let [replyData, setReplyData] = useState({
        body: null,
        attachment: null
    })

    let deleteComment = async (e) => {
        try {
            let commentId = $(e.currentTarget).attr('dataid');
            let postId = post._id;

            $(e.currentTarget).parents('.comment-container').remove();

            let dltRes = await api.post('/comment/deleteComment', { commentId, postId })
            if (dltRes.status === 200) {

                // let data = dltRes.data
                // data.author = myProfile
                // return commentState(state => state - 1)

            }
        } catch (error) {
            console.log(error)
        }
    }

    let handleReplyBodyChange = async (e) => {
        setReplyData(state => {
            return {
                ...state,
                body: e.target.value
            }
        })
    }

    let handleReplyKeyUp = async (e) => {
        e.preventDefault()
        if (e.keyCode === 13) {

            let commentId = e.currentTarget.dataset.comment
            if (replyData) {
                let uploadReplyRes = await api.post('/comment/addReply', { replyMsg: replyData.body, authorId: myProfile._id, commentId })
                if (uploadReplyRes.status == 200) {
                    setIsReply(false)
                    let newReplyData = uploadReplyRes.data;
                    setReplies(replies => [...replies, newReplyData])
                }

            }
        }


    }

    let clickReplySendBtn = async (e) => {
        let commentId = e.currentTarget.dataset.comment
        if (replyData) {
            let uploadReplyRes = await api.post('/comment/addReply', { replyMsg: replyData.body, authorId: myProfile._id, commentId })
            if (uploadReplyRes.status == 200) {
                setIsReply(false)
                let newReplyData = uploadReplyRes.data;
                setReplies(replies => [...replies, newReplyData])
            }

        }
    }

    // handle add attachmenent to comment on click
    let clickCommentOption = (e) => {
        if ($(e.currentTarget).children('.options-container').hasClass('open')) {
            $(e.currentTarget).children('.options-container').removeClass('open');
        } else {
            $(e.currentTarget).children('.options-container').addClass('open');
        }
    }
    // handle comment attachment change


    let handleCommentLikeBtnClick = async (e) => {
        let commentId = e.currentTarget.dataset.id
        if ($(e.currentTarget).hasClass('reacted')) {
            let updatedComment = await api.post('/comment/removeReact', { commentId, reactorId: myId })
            if (updatedComment.status == 200) {
                $(e.target).removeClass('reacted')
                setTotalComment(comment => comment - 1)
            }
        } else {
            let updatedComment = await api.post('/comment/addReact', { commentId, reactorId: myId })
            if (updatedComment.status == 200) {
                setTotalComment(comment => comment + 1)
                $(e.target).addClass('reacted')
            }
        }

    }


    return (
        <>
            <div className={`comment-container comment-id-${comment._id}`}>
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
                            {
                                comment.attachment &&
                                <div className='comment-attachment-container'>
                                    <img src={comment.attachment} alt='attachment' />
                                </div>

                            }

                        </div>

                        {

                            comment.author._id == myProfile._id ?
                                <div onClick={clickCommentOption} className="options-icon">
                                    <i className="far fa-ellipsis-h"></i>
                                    <div className='options-container'>
                                        <button dataid={comment._id} onClick={deleteComment.bind(this)} className="comment-option text-danger">
                                            Delete Comment
                                        </button>
                                    </div>
                                </div>
                                : ''
                        }


                    </div>



                    <div className="comment-react">
                        <div className={`like button ${isReacted ? 'reacted' : ''}`} onClick={handleCommentLikeBtnClick.bind(this)} data-id={comment._id}>Like {`${totalComment > 0 ? '(' + totalComment + ')' : ''}`}</div>
                        <div className="reply button" data-id={comment._id} onClick={handleCommentReplyBtnClick.bind(this)}>Reply</div>


                        <div className="comment-time"><Moment fromNow>{comment.createdAt}</Moment></div>
                    </div>
                    {isReply &&
                        (
                            <div className="new-reply">
                                <div className="comment-field">
                                    <input onKeyUp={handleReplyKeyUp} onChange={handleReplyBodyChange.bind(this)} className="field-comment-text" type="text" data-comment={comment._id} placeholder={`Reply to ${comment.author.fullName}`} />
                                    <div onClick={clickReplySendBtn.bind(this)} data-comment={comment._id} className="comment-attachment">
                                        {/* <input onChange={handleReplyAttachChange} className="attachment" type="file" /> */}
                                        <span className="icon">
                                            <i className="far fa-paper-plane"></i>
                                        </span>

                                    </div>

                                </div>
                            </div>
                        )}

                    {
                        replies.map((item, index) => {

                            return (
                                <SingleReply setReplies={setReplies} replies={replies} comment={comment} item={item} key={index} myProfile={myProfile}></SingleReply>
                            )

                        })
                    }


                </div>
            </div>
        </>
    )

}

export default SingleComment