import React, { useState, useCallback, useEffect, useRef } from 'react';
import socket from '../../common/socket';
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/api';

import { sendMessage } from '../../services/actions/messageActions';

const ChatFooter = ({ chatFooter,room,isReplying,friendId,setIsTyping,chatNewAttachment,messageActionButtonContainer,setIsReplying,userId,messageInput,replyData,isPreview, setIsPreview }) => {

    const dispatch = useDispatch()
    const [mInputWith, setmInputWith] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState(false)
    const imageInput = useRef(null);
    const settings = useSelector(state => state.setting)

    useEffect(() => {
        console.log('rdt', isReplying,replyData)
    },[replyData])

    const handleSendMessage = useCallback((e) => {
        e.preventDefault();
        e.target.value = ''

        let isDisabled = $(e.target).hasClass('button-disabled') || false
        if (isDisabled) return;

        if (room) {

            if (isReplying) {
                let data = { room, senderId: userId, receiverId: friendId, message: inputValue, attachment: attachmentUrl, parent: replyData.messageId }
                socket.emit('sendMessage', data);
                setInputValue('')
                setIsTyping(false)
                dispatch(sendMessage(data))

                setTimeout(() => {
                    document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });

                }, 500);
            } else {
                let data = { room, senderId: userId, receiverId: friendId, message: inputValue, attachment: attachmentUrl, parent: false }
                socket.emit('sendMessage', data);
                setInputValue('')
                setIsTyping(false)
                dispatch(sendMessage(data))

                setTimeout(() => {
                    document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });
                }, 500);
            }

            setIsReplying(false)
            setIsPreview(false)
            setAttachmentUrl(false)


        }
    })



    let addTyping = (e) => {
        socket.emit('typing', { receiverId: userId, room, isTyping: true, type: inputValue })
    }

    let removeTyping = () => {
        socket.emit('typing', { receiverId: userId, room, isTyping: false, type: inputValue })
    }

    // let updateTyping = (e) => {
    //     let value = e.target.value;
    //     if(settings.showIsTyping) {
    //         socket.emit('update_type', { room, type: value })
    //     }
    // }
    const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        keyCode: 13,
        code: "Enter",
        which: 13,
        bubbles: true
    });

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSendMessage(event)
            setInputValue(""); // Clear input after action
        }
    };

    let likeButtonClick = (e) => {
        setInputValue('👍')
        setTimeout(() => {
            messageInput.current.dispatchEvent(enterEvent);
        }, 200)
    }

    let handleInputChange = (e) => {
        setInputValue(e.target.value)

        if(settings.showIsTyping) {
            socket.emit('update_type', { room, type: e.target.value })
        }
    }

    let handlePreviewCloseBtn = (e) => {
        setIsPreview(false)
        setIsReplying(false)
    }


    let handleMessageImageButtonClick = async (e) => {
        let clickEvent = new MouseEvent('click', { bubbles: true, cancelable: false })
        let attachmentInput = document.createElement('input')
        attachmentInput.type = 'file'

        attachmentInput.addEventListener('change', (async (e) => {
            let attachmentFile = e.target.files[0]
            if (attachmentFile) {
                let attachmentFormData = new FormData();
                attachmentFormData.append('image', attachmentFile)
                setAttachmentUrl('https://res.cloudinary.com/dz88yjerw/image/upload/v1743092084/i5lcu63atrbkpcy6oqam.gif')
                setIsPreview(true)

                let uploadAttachmentRes = await api.post('/upload', attachmentFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (uploadAttachmentRes.status === 200) {
                    let attachmentUrl = uploadAttachmentRes.data.secure_url;
                    if (attachmentUrl) {
                        setAttachmentUrl(attachmentUrl)
                    }
                }

            }
        }))

        if (attachmentInput) {
            attachmentInput.dispatchEvent(clickEvent)
        }

    }

    let handleMessageImageChange = async (e) => {

    }


    return (
        <>
            <div ref={chatFooter} className="chat-footer">

                {
                    isPreview && (<div className='new-message-preview-container'>
                        {
                            isReplying  && (
                                <div className='reply-message-preview-form'>
                                    <p className='text-small'>
                                        {replyData.body}
                                    </p>
                                </div>
                            )
                        }
                        {
                            attachmentUrl && (
                                <div className='attachment-preview-container'>
                                    <img className='attachment-preview' src={attachmentUrl} alt='Message Attachment' />
                                </div>
                            )
                        }

                        <span onClick={handlePreviewCloseBtn} className='preview-close-button bg-danger'>
                            <i className='fa fa-times'></i>
                        </span>
                    </div>)
                }


                <div className="new-message-container">
                    <div ref={chatNewAttachment} className='chat-new-attachment'>
                        <div className='chat-atachment-button-container'>

                            <div className='chat-attachment-button'>
                                <i className="fas fa-plus-circle"></i>
                            </div>

                            <div className='chat-attachment-button' onClick={handleMessageImageButtonClick.bind(this)}>
                                <i className="fas fa-images"></i>
                                <input type='file' style={{ display: 'none' }} ref={imageInput} onChange={handleMessageImageChange.bind(this)} />
                            </div>

                            <div className='chat-attachment-button'>
                                <i className="fas fa-microphone"></i>
                            </div>
                        </div>
                    </div>
                    <div className='new-message-form'>
                        <div className='new-message-input-container'>
                            <input ref={messageInput} style={{ width: mInputWith + 'px' }} onChange={handleInputChange} value={inputValue} onKeyDown={handleKeyPress} placeholder='Send Message....' id='newMessageInput' className='new-message-input' onFocus={addTyping} onBlur={removeTyping} />
                        </div>
                        <div ref={messageActionButtonContainer} className='message-action-button-container'>

                            {
                                inputValue.length > 0 || attachmentUrl ? <div onClick={handleSendMessage} className={`message-action-button send-message ${attachmentUrl == 'https://res.cloudinary.com/dz88yjerw/image/upload/v1743092084/i5lcu63atrbkpcy6oqam.gif' && 'button-disabled'}`}>
                                    <i className="fas fa-paper-plane"></i>
                                </div>

                                    : <div onClick={likeButtonClick} className='message-action-button send-like'>
                                        <i className="fas fa-thumbs-up"></i>
                                    </div>
                            }

                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}

export default ChatFooter;
