import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/api';
import UserPP from '../components/UserPP';
import { io } from 'socket.io-client';
import MessageList from '../components/Message/MessageList';
import moment from "moment";
import $ from 'jquery'
const Chat = ({ socket }) => {

    let profile = useSelector(state => state.profile)
    let headerHeight = useSelector(state => state.option.headerHeight)
    let bodyHeight = useSelector(state => state.option.bodyHeight)
    let userId = profile._id
    let [friendProfile, setFriendProfile] = useState({})
    let [friendId, setFriendId] = useState({})
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLike, setIsLike] = useState(true);
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
    const chatFooterWidth = chatFooter.current?.offsetWidth;
    const newAttachmentWidth = chatNewAttachment.current?.offsetWidth;
    const messageActionButtonContainerWidth = messageActionButtonContainer.current?.offsetWidth;

    // messageInput.current.style.width = messageInputWidth;
    const listContainerHeight = bodyHeight - headerHeight - chatHeaderHeight - chatFooterHeight
    let params = useParams()
    let profileId = params.profile;
    const newRoom = [userId, profileId].sort().join('_');

    useEffect(() => {
        let messageInputWidth = chatFooterWidth - newAttachmentWidth - messageActionButtonContainerWidth - 10
        setmInputWith(messageInputWidth)
        setTimeout(() => {
            let lastMessageItem = document.querySelector('#chatMessageList .chat-message-container:last-child')
            if(lastMessageItem) {
                lastMessageItem.scrollIntoView({ behavior: "smooth" });

            }
        }, 500);


        if (profileId === userId) return; // Prevent self-chat
        setRoom(newRoom);
        socket.emit('startChat', { user1: userId, user2: profileId });

        socket.on('previousMessages', (msgs) => {
            setMessages(msgs);
        });

        socket.on('roomJoined', ({ room }) => {
            console.log(`Joined room: ${room}`);
        });
        socket.on('newMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            document.querySelector('#chatMessageList .chat-message-container:last-child').scrollIntoView({ behavior: "smooth" });
        });

        return () => {
            socket.off('newMessage');
            socket.off('previousMessages');
        };
    }, [socket, newRoom, params]);


    useEffect(() => {
        api.get('/profile', {
            params: {
                profileId: profileId
            }
        }).then((res) => {
            setFriendProfile(res.data)
            setFriendId(res.data.id)
        }).catch(e => console.log(e))


    }, [socket, params])


    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() && room) {
            socket.emit('sendMessage', { room, senderId: userId, receiverId: profileId, message: inputValue });
            setInputValue('')

            setTimeout(() => {
                document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });

            }, 500);

        }
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

    socket.on('deleteMessage', (messageId) => {

        $(`.message-id-${messageId}`).remove();
    })


    let handleLikeMessage  = async (e) => {

    }
    let handleShareMessage = async (e) => {

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
        setIsLike(false)
        setInputValue(e.target.value)
    }

    const cmlStyles = {
        height: `${listContainerHeight + chatHeaderHeight}px`,
        maxHeight: `${listContainerHeight + chatHeaderHeight}px`,
        paddingTop: `${chatHeaderHeight}px`,
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

            <div id="chatBox" style={{ height: `${bodyHeight - headerHeight}px` }}>
                <div ref={chatHeader} className='chat-header'>
                    <div className='chat-header-user'>
                        <div className='chat-header-profilePic'>
                            <UserPP profilePic={`${friendProfile.profilePic}`} hasStory={false} profile={friendProfile._id} active></UserPP>
                        </div>
                        <div className='chat-header-user-info'>
                            <h4 className='chat-header-username'> {`${friendProfile.user && friendProfile.user.firstName} ${friendProfile.user && friendProfile.user.surname}`}</h4>
                            <span className='chat-header-active-status'>Active Now</span>
                        </div>
                    </div>


                    <div className='chat-header-action'>
                        <div className='chat-header-action-btn-container'>
                            <div className='call-button action-button'>
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <div className='video-call-button action-button'>
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
                                                        <button type='button' dataid={msg._id} className='chat-message-option share' onClick={handleShareMessage.bind(this)}><i className="fa fa-share"></i></button>

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
                                                        <button type='button' dataid={msg._id} className='chat-message-option share' onClick={handleShareMessage.bind(this)}><i className="fa fa-share"></i></button>

                                                        <button type='button' dataid={msg._id} className='chat-message-option delete' onClick={handleDeleteMessage.bind(this)}><i className="fa fa-trash"></i></button>
                                                    </div>

                                                    <p className='message-container mb-0' >
                                                        {msg.message}
                                                    </p>


                                                </div>


                                                <div className='chat-message-seen-status'>
                                                    <img src={friendProfile.profilePic} alt='Seen' />
                                                </div>
                                            </div>


                                    )
                                })

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
                                <input ref={messageInput} style={{ width: mInputWith + 'px' }} onChange={handleInputChange} onKeyDown={handleKeyPress} placeholder='Send Message....' value={inputValue} id='newMessageInput' className='new-message-input' />
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