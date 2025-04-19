import React, { useEffect, useState, useRef } from 'react';
import { setLoading } from '../services/actions/optionAction';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import UserPP from '../components/UserPP';
import moment from "moment";
import SingleMessage from '../components/Message/SingleMessage';
import $, { param } from 'jquery'
import * as faceapi from "face-api.js";
import { current } from '@reduxjs/toolkit';
import { sendMessage } from "../services/actions/messageActions";
import Peer from 'simple-peer';
import ModalContainer from '../components/modal/ModalContainer';
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


const Chat = ({ socket, cameraVideoRef }) => {
    let dispatch = useDispatch();
    let profile = useSelector(state => state.profile)
    let headerHeight = useSelector(state => state.option.headerHeight)
    let bodyHeight = useSelector(state => state.option.bodyHeight)
    let settings = useSelector(state => state.setting)
    let userId = profile._id
    let [friendProfile, setFriendProfile] = useState({})
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typeMessage, setTypeMessage] = useState('');
    const [mInputWith, setmInputWith] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [lastSeen, setLastSeen] = useState(false);
    const [stream, setStream] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [me, setMe] = useState('');
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState();
    const [isVideoCalling, setIsVideoCalling] = useState(false)

    const [isReplying, setIsReplying] = useState(false);
    const [attachmentUrl, setAttachmentUrl] = useState(false)
    const [replyData, setReplyData] = useState({ messageId: null, body: null });
    const msgListRef = useRef(null);
    let messageInput = useRef(null);
    const chatHeader = useRef(null);
    const chatFooter = useRef(null);

    const chatNewAttachment = useRef(null);
    const messageActionButtonContainer = useRef(null);
    const imageInput = useRef(null);
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const chatHeaderHeight = chatHeader.current?.offsetHeight;
    const chatFooterHeight = chatFooter.current?.offsetHeight;
    const chatFooterWidth = chatFooter.current?.offsetWidth;
    const newAttachmentWidth = chatNewAttachment.current?.offsetWidth;
    const messageActionButtonContainerWidth = messageActionButtonContainer.current?.offsetWidth;
    const messageInputWidth = chatFooterWidth - newAttachmentWidth - messageActionButtonContainerWidth
    let isLoading = useSelector(state => state.option.isLoading);

    useEffect(() => {
        setMe(profile._id)

    }, [profile])

    if (messageInput.current !== null) {
        messageInput.current.style.width = messageInputWidth + 'px'
    }


    const chatBoxHeight = bodyHeight - headerHeight
    let params = useParams()
    let friendId = params.profile;

    const [emotion, setEmotion] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [myEmotion, setMyEmotion] = useState(false)
    const [listContainerHeight, setListContainerHeight] = useState(chatBoxHeight - chatHeaderHeight - chatFooterHeight);
    const [cmlStyles, setCmlStyles] = useState({
        height: `${isMobile ? bodyHeight - headerHeight - chatFooterHeight - chatHeaderHeight : listContainerHeight}px`,
        maxHeight: `${isMobile ? listContainerHeight + headerHeight : listContainerHeight}px`,
        overflowY: 'scroll'
    });

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        let newListHeaderHeight = bodyHeight - headerHeight - chatHeaderHeight - chatFooterHeight
        setListContainerHeight(newListHeaderHeight)

        if (isReplying == true) {
            setIsPreview(true)
        } else {
            setIsPreview(false)
        }

        setCmlStyles({
            height: `${isMobile ? bodyHeight - headerHeight - chatFooterHeight - chatHeaderHeight : listContainerHeight}px`,
            maxHeight: `${isMobile ? listContainerHeight + headerHeight : listContainerHeight}px`,
            overflowY: 'scroll'
        })
    }, [isReplying, isLoaded])

    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const el = msgListRef.current;
            const scrollTop = el.scrollTop;
            const scrollHeight = el.scrollHeight - el.clientHeight;
            const percent = (scrollTop / scrollHeight) * 100;
            setScrollPercent(percent);
        };

        const el = msgListRef.current;
        if (el) {
            el.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (el) {
                el.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    useEffect(() => {


        if (hasMoreMessages) {
            if (scrollPercent < 30) {
                socket.emit('loadMessages', { myId: userId, friendId, skip: messages.length })
                setHasMoreMessages(false)
            }
        }

    }, [scrollPercent])


    useEffect(() => {
        socket.emit('is_active', { profileId: friendId, myId: userId });
        socket.on('is_active', (data, ls) => {
            setIsActive(data)
            let lastSeenTime = moment(ls)
            const formattedTime = lastSeenTime.format("hh:mm A")
            setLastSeen(formattedTime)
        })

        socket.on('messageReacted', (messageId) => {
            let msgSelector = '#chatMessageList .chat-message-container .message-id-' + messageId
            $(msgSelector).addClass('message-reacted')
        })

        socket.on('messageReactRemoved', (messageId) => {
            if (messageId) {
                let msgSelector = '#chatMessageList .chat-message-container .message-id-' + messageId
                $(msgSelector).removeClass('message-reacted')
            }

        })

        return () => {
            socket.off('messageReacted')
            socket.off('messageReactRemoved')
            socket.off('is_active')
        }
    }, [params])


    useEffect(() => {
        setIsLoaded(!isLoaded)
    }, [listContainerHeight])

    useEffect(() => {

        api.get('/profile', {
            params: {
                profileId: friendId
            }
        }).then((res) => {
            // alert('data load')
            setFriendProfile(res.data)
            dispatch(setLoading(false))

        }).catch(e => console.log(e))

    }, [params, friendId])

    useEffect(() => {

        setTimeout(() => {
            document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });
        }, 1200);

        if (!friendId || !userId) return; // Prevent self-chat
        const newRoom = [userId, friendId].sort().join('_');
        socket.emit('startChat', { user1: userId, user2: friendId });
        setRoom(newRoom);
        socket.on('roomJoined', ({ room }) => {
            console.log(`Joined room: ${room}`);
            localStorage.setItem('roomId', room);
        });


        socket.on('loadMessages', ({ loadedMessages, hasNewMessage }) => {
            setHasMoreMessages(hasNewMessage)
            setMessages(messages => [...loadedMessages, ...messages])
            // setPageNumber(currentPage + 1)
        })

        socket.on('previousMessages', (msgs) => {
            setMessages(msgs);
            setHasMoreMessages(true)
        });
        socket.on('newMessage', (msg) => {
            if (msg.receiverId == userId && msg.senderId == friendId) {
                setMessages((prevMessages) => [...prevMessages, msg]);

                setTimeout(() => {
                    document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });
                }, 500);
            }
            if (msg.senderId == userId && msg.receiverId == friendId) {
                setMessages((prevMessages) => [...prevMessages, msg]);

                setTimeout(() => {
                    document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });
                }, 500);
            }

        });
        socket.on('deleteMessage', (messageId) => {
            if ($(`#chatBox .chat-body .chat-message-list`).has(`.chat-message-container.message-id-${messageId}`)) {
                $(`#chatBox .chat-body .chat-message-list .chat-message-container.message-id-${messageId}`).hide();
            }
        })

        socket.on('typing', ({ receiverId, isTyping, type }) => {

            if (receiverId == friendId) {
                if (isTyping == true) {
                    setIsTyping(true)
                    setTypeMessage(type)
                    setTimeout(() => {
                        document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });
                    }, 500);
                } else {
                    setIsTyping(false)
                }
            }

        })

        socket.on('update_type', ({ type }) => {
            setTypeMessage(type)
        })
        return () => {
            socket.off('newMessage');
            socket.off('previousMessages');
            socket.off('deleteMessage')
            socket.off('update_type')
            socket.off('typing')
            socket.off('loadMessages')
        };
    }, [params, friendProfile]);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                let lastMessage = messages[messages.length - 1];
                if (lastMessage.senderId !== userId) {
                    socket.emit('seenMessage', lastMessage);
                }
            }, 2000);
        }
        socket.on('seenMessage', (msg) => {
            $('#chatMessageList .message-sent.chat-message-container .chat-message-seen-status').css('visibility', 'hidden');
            $('#chatMessageList .message-sent.chat-message-container.message-id-' + msg._id + ':last-child .chat-message-seen-status').css('visibility', 'visible');
        })

        return () => {
            socket.off('seenMessage');
        }
    }, [params, messages])

    useEffect(() => {
        if (room) {
            console.log(room, 'room')
            startVideo();
            loadModels();
        }

    }, [room, params]);

    useEffect(() => {


        if (myEmotion && friendId) {
            socket.emit('emotion_change', { room: room, emotion: myEmotion, friendId })

        }
    }, [myEmotion, friendId])

    useEffect(() => {


        socket.on('emotion_change', (emotion) => {
            setEmotion(emotion)
        })

        return () => {
            socket.off('emotion_change')
        }
    }, [emotion])

    const startVideo = () => {
        if (settings.isShareEmotion === true) {
            if (!navigator.mediaDevices) return;
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                cameraVideoRef.current.srcObject = stream;
            }).catch((err) => console.error("Error accessing webcam: ", err));
        }

    };



    const loadModels = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        detectEmotions();
    };

    const detectEmotions = () => {
        setInterval(async () => {
            if (cameraVideoRef.current) {
                const detections = await faceapi.detectAllFaces(cameraVideoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();

                if (detections.length > 0) {
                    const emotions = detections[0].expressions;
                    const maxEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
                    if (room && myEmotion !== maxEmotion) {
                        setMyEmotion(maxEmotion)
                    }
                }

            }
        }, 500);

    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        e.target.value = ''

        let isDisabled = $(e.target).hasClass('button-disabled') || false
        if (isDisabled) return;

        if (inputValue.trim() && room) {

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
    }

    let addTyping = (e) => {
        socket.emit('typing', { receiverId: userId, room, isTyping: true, type: inputValue })
    }

    let removeTyping = () => {
        socket.emit('typing', { receiverId: userId, room, isTyping: false, type: inputValue })
    }

    let updateTyping = (e) => {
        let value = e.target.value;
        socket.emit('update_type', { room, type: value })
    }
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
    useEffect(() => {

    }, [isVideoCalling]);

    useEffect(() => {


        socket.on('receive-call', (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });

        socket.on('leaveVideoCall', (leaveVideoCall) => {
            setReceivingCall(false)
            setIsVideoCalling(false)
            setCallAccepted(false)
        })

        return () => {
            socket.off('receive-call')
            socket.off('leaveVideoCall')
        }
    }, [])

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on('signal', (data) => {
            socket.emit('call-user', {
                userToCall: id,
                signalData: data,
                from: me,
                name: profile.fullName,
            });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('call-accepted', (signal) => {
            setCallAccepted(true);
            if (signal) {
                console.log('Stream tracks:', stream?.getTracks().map(t => t.kind));
                peer.signal(signal);

            }
        });

        connectionRef.current = peer;
    };

    let handleVideoCallBtn = (e) => {
        setIsVideoCalling(true)
        let receiverId = e.currentTarget.dataset.id

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);

            if (myVideo.current) {
                myVideo.current.srcObject = stream;
            }
        });

        callUser(receiverId)


    }

    let closeVideoCall = e => {
        if (isVideoCalling || callAccepted) {
            setIsVideoCalling(true)

        } else {
            setIsVideoCalling(false)

        }
    }

    let handleLeaveCall = () => {
        setCallAccepted(false);
        setIsVideoCalling(false);
        socket.emit('leaveVideoCall', friendId)
        // leaveCall()
        setIsVideoCalling(false)
    }


    return (
        <div>
            <div id="chatBox" style={{ minHeight: `${chatBoxHeight}px` }}>
                <div ref={chatHeader} className='chat-header'>
                    <div className='chat-header-user'>
                        <div className='chat-header-profilePic'>
                            <UserPP profilePic={`${friendProfile.profilePic}`} hasStory={false} profile={friendProfile._id} active={isActive ? true : false}></UserPP>
                        </div>
                        <div className='chat-header-user-info'>
                            <h4 className='chat-header-username'> {`${friendProfile == true && friendProfile.fullName ? friendProfile.fullName : friendProfile.user && friendProfile.user.firstName + ' ' + friendProfile.user.surname}`}</h4>
                            {isActive ? (<span className='chat-header-active-status'>Online </span>) : (lastSeen && <span className='chat-header-active-status'>Last Seen: {lastSeen} </span>)}

                            {
                                emotion && (<span className='chat-header-active-status text-capitalized'> | {emotion}</span>)
                            }

                        </div>
                    </div>

                    <div className='chat-header-action'>
                        <div className='chat-header-action-btn-container'>
                            <div className='call-button action-button'>
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <div onClick={handleVideoCallBtn} data-id={friendId} className='video-call-button action-button'>
                                <i className="fas fa-video"></i>
                            </div>
                            <div className='info-button action-button'>
                                <i className="fas fa-info-circle"></i>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='chat-body'>
                    <div className='chat-message-list' style={cmlStyles} id='chatMessageList' ref={msgListRef} >

                        {
                            messages.map((msg, index) => {


                                return (

                                    <SingleMessage key={index} msg={msg} friendProfile={friendProfile} messages={messages} isActive={isActive} setIsReplying={setIsReplying} setReplyData={setReplyData} />
                                )
                            })

                        }

                        {
                            isTyping && (
                                <div className={`chat-message-container message-receive message-typing`}>
                                    <div className='chat-message-profilePic'>
                                        <UserPP profilePic={`${friendProfile.profilePic}`} profile={friendProfile._id} active></UserPP>
                                    </div>
                                    <div className='chat-message'>

                                        <p className='message-container mb-0'>
                                            {typeMessage || '...'}
                                        </p>
                                    </div>

                                </div>
                            )
                        }



                    </div>
                </div>

                <div ref={chatFooter} className="chat-footer">

                    {
                        isPreview && (<div className='new-message-preview-container'>
                            {
                                isReplying && (
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
                                <input ref={messageInput} style={{ width: mInputWith + 'px' }} onChange={handleInputChange} value={inputValue} onKeyDown={handleKeyPress} placeholder='Send Message....' id='newMessageInput' className='new-message-input' onFocus={addTyping} onKeyUp={updateTyping.bind(this)} onBlur={removeTyping} />
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
            </div>

            <ModalContainer
                title="Video Call"
                style={{ width: isMobile ? '95%' : "600px", top: "50%" }}
                isOpen={isVideoCalling || callAccepted}
                onRequestClose={closeVideoCall}
                id="videoCallModal"
            >
                <div style={{ padding: 0 }}>
                    {/* <h2 className='text-center text-primary'>Video Call</h2> */}
                    <p className='fs-3 text-center'>
                        Calling {friendProfile && friendProfile.fullName}
                    </p>
                    <div className='video-call-container'>
                        <video playsInline muted ref={myVideo} autoPlay className='my-video' style={{ width: '150px' }} />
                        {<video playsInline ref={userVideo} className='friends-video' autoPlay style={{ width: '100%' }} />}
                    </div>
                    <div className='call-buttons'>
                        <button onClick={handleLeaveCall.bind(this)} className='call-button-ends call-button bg-danger'>
                            <i class="fa fa-phone"></i>
                        </button>

                    </div>
                    {/* {receivingCall && !callAccepted && (
                                    <div>
                                        <h3>Incoming Call...</h3>
                                        <button onClick={answerCall}>Answer</button>
                                    </div>
                                )} */}
                </div>
            </ModalContainer>

        </div>
    );
};

export default Chat;