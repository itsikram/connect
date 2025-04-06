import React, { useEffect, useState, useRef, useId } from 'react';
import { setLoading } from '../services/actions/optionAction';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import UserPP from '../components/UserPP';
import moment from "moment";
import $ from 'jquery'
import * as faceapi from "face-api.js";


const Chat = ({ socket }) => {
    let dispatch = useDispatch();
    let profile = useSelector(state => state.profile)
    let headerHeight = useSelector(state => state.option.headerHeight)
    let bodyHeight = useSelector(state => state.option.bodyHeight)
    let userId = profile._id
    let [friendProfile, setFriendProfile] = useState({})
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typeMessage, setTypeMessage] = useState('');
    const [mInputWith, setmInputWith] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef(null);
    let messageInput = useRef(null);
    const chatHeader = useRef(null);
    const chatFooter = useRef(null);
    const chatNewAttachment = useRef(null);
    const messageActionButtonContainer = useRef(null);

    const chatHeaderHeight = chatHeader.current?.offsetHeight;
    const chatFooterHeight = chatFooter.current?.offsetHeight;
    // const chatFooterWidth = chatFooter.current?.offsetWidth;
    // const newAttachmentWidth = chatNewAttachment.current?.offsetWidth;
    // const messageActionButtonContainerWidth = messageActionButtonContainer.current?.offsetWidth;
    // let isLoading = useSelector(state => state.option.isLoading);

    // messageInput.current.style.width = messageInputWidth;
    const listContainerHeight = bodyHeight - headerHeight - chatHeaderHeight - chatFooterHeight
    let params = useParams()
    let friendId = params.profile;

    const emotionVideoRef = useRef(null);
    const [emotion, setEmotion] = useState(false);
    const [myEmotion, setMyEmotion] = useState(false)

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
        // stopVideo()

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



        socket.on('previousMessages', (msgs) => {
            setMessages(msgs);

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

        console.log(myEmotion)
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
        if(!navigator.mediaDevices) return;
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                emotionVideoRef.current.srcObject = stream;
            }).catch((err) => console.error("Error accessing webcam: ", err));
    };
    const stopVideo = () => {
        if (!navigator.mediaDevices) return;
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    document.getElementById('video').srcObject = null;
                  }
            })
            .catch((err) => console.error("Error accessing webcam: ", err));
    };

    let handleVideoCallBtn = () => {

    }

    const loadModels = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        detectEmotions();
    };

    const detectEmotions = () => {
        setInterval(async () => {
            if (emotionVideoRef.current) {
                const detections = await faceapi.detectAllFaces(emotionVideoRef.current, new faceapi.TinyFaceDetectorOptions())
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
        if (inputValue.trim() && room) {
            socket.emit('sendMessage', { room, senderId: userId, receiverId: friendId, message: inputValue });
            setInputValue('')
            setIsTyping(false)
            setTimeout(() => {
                document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });

            }, 500);

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
    let handleDeleteMessage = async (e) => {
        let messageId = $(e.currentTarget).attr('dataid');
        socket.emit('deleteMessage', messageId);

    }

    let handleLikeMessage = async (e) => {

    }
    let handleSpeakMessage = async (e) => {
        socket.emit('speak_message', $(e.currentTarget).attr('dataid'), friendId);
    }
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

    const cmlStyles = {
        height: `${listContainerHeight}px`,
        maxHeight: `${listContainerHeight}px`,
        overflowY: 'scroll'
    }

    let getMessageTime = (timestamp) => {
        const inputDate = moment(timestamp);
        const now = moment();


        // Format based on condition
        const formattedTime = inputDate.format("DD/MM/YY hh:mm A")

        return formattedTime;
    }

    return (
        <div>
            <video style={{ display: 'block' }} ref={emotionVideoRef} autoPlay muted width="600" height="400" />

            <div id="chatBox" style={{ height: `${bodyHeight - headerHeight}px` }}>
                <div ref={chatHeader} className='chat-header'>
                    <div className='chat-header-user'>
                        <div className='chat-header-profilePic'>
                            <UserPP profilePic={`${friendProfile.profilePic}`} hasStory={false} profile={friendProfile._id} active></UserPP>
                        </div>
                        <div className='chat-header-user-info'>
                            <h4 className='chat-header-username'> {`${friendProfile?.user?.firstName ? friendProfile.user && friendProfile.user.firstName + ' ' + friendProfile.user.surname : friendProfile.fullName}`}</h4>
                            <span className='chat-header-active-status'>Active Now</span>

                            {
                                emotion && (<span className='chat-header-active-status'> Emotion {emotion}</span>)
                            }


                        </div>
                    </div>

                    <div className='chat-header-action'>
                        <div className='chat-header-action-btn-container'>
                            <div className='call-button action-button'>
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <div onClick={handleVideoCallBtn} className='video-call-button action-button'>
                                <i className="fas fa-video"></i>
                            </div>
                            <div className='info-button action-button'>
                                <i className="fas fa-info-circle"></i>
                            </div>
                        </div>
                    </div>

                </div>
                <div>
                    <div className='chat-body'>
                        <div className='chat-message-list' style={cmlStyles} id='chatMessageList' ref={bottomRef} >

                            {
                                messages.map((msg, index) => {
                                    return (


                                        msg.senderId !== userId ?


                                            <div key={index} className={`chat-message-container message-receive message-id-${msg._id}`} data-toggle="tooltip" title={getMessageTime(msg.timestamp)}>
                                                <div className='chat-message-profilePic'>
                                                    <UserPP profilePic={`${friendProfile.profilePic}`} profile={friendProfile._id} active></UserPP>
                                                </div>
                                                <div className='chat-message'>
                                                    <div className='chat-message-options'>
                                                        <button type='button' dataid={msg._id} className='chat-message-option like' onClick={handleLikeMessage.bind(this)}><i className="fa fa-thumbs-up"></i></button>
                                                        <button type='button' dataid={msg._id} className='chat-message-option share' onClick={handleSpeakMessage.bind(this)}><i className="fa fa-speaker"></i></button>

                                                        <button type='button' dataid={msg._id} className='chat-message-option delete' onClick={handleDeleteMessage.bind(msg)}><i className="fa fa-trash"></i></button>
                                                    </div>


                                                    <p className='message-container mb-0'>
                                                        {msg.message}
                                                    </p>
                                                </div>
                                                <div className='chat-message-seen-status d-none'>
                                                    Seen
                                                </div>
                                            </div>
                                            :

                                            <div key={index} className={`chat-message-container message-sent message-id-${msg._id}`} data-toggle="tooltip" title={getMessageTime(msg.timestamp)}>


                                                <div className='chat-message'>
                                                    <div className='chat-message-options'>
                                                        <button type='button' dataid={msg._id} className='chat-message-option like' onClick={handleLikeMessage.bind(this)}><i className="fa fa-thumbs-up"></i></button>
                                                        <button type='button' dataid={msg._id} className='chat-message-option share speaker' onClick={handleSpeakMessage.bind(this)}><i className="fa fa-speaker"></i></button>

                                                        <button type='button' dataid={msg._id} className='chat-message-option delete' onClick={handleDeleteMessage.bind(this)}><i className="fa fa-trash"></i></button>
                                                    </div>

                                                    <p className='message-container mb-0' >
                                                        {msg.message}
                                                    </p>


                                                </div>

                                                {

                                                    <div className='chat-message-seen-status' style={{ 'visibility': (messages[messages.length - 1]._id === msg._id && msg.isSeen == true) ? 'visible' : 'hidden' }}>
                                                        <img src={friendProfile.profilePic} alt='Seen' />
                                                    </div>
                                                }
                                            </div>


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

                </div>

                <div ref={chatFooter} className="chat-footer">
                    <div className="new-message-container">

                        <div ref={chatNewAttachment} className='chat-new-attachment'>
                            <div className='chat-atachment-button-container'>

                                <div className='chat-attachment-button'>
                                    <i className="fas fa-plus-circle"></i>
                                </div>

                                <div className='chat-attachment-button'>
                                    <i className="fas fa-images"></i>
                                </div>

                                <div className='chat-attachment-button'>
                                    <i className="fas fa-microphone"></i>
                                </div>
                            </div>


                        </div>
                        <div className='new-message-form'>
                            <div className='new-message-input-container'>
                                <input ref={messageInput} style={{ width: mInputWith + 'px' }} onChange={handleInputChange} onKeyDown={handleKeyPress} placeholder='Send Message....' value={inputValue} id='newMessageInput' className='new-message-input' onFocus={addTyping} onKeyUp={updateTyping.bind(this)} onBlur={removeTyping} />
                            </div>
                            <div ref={messageActionButtonContainer} className='message-action-button-container'>

                                {
                                    inputValue.length > 0 ? <div onClick={handleSendMessage} className='message-action-button send-message'>
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

        </div>
    );
};

export default Chat;