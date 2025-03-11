import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/api';
import UserPP from '../components/UserPP';
import { io } from 'socket.io-client';
import MessageList from '../components/Message/MessageList';

const socket = io.connect(process.env.REACT_APP_SERVER_ADDR)
const Chat = ({ socket }) => {

    let profile = useSelector(state => state.profile)
    let headerHeight = useSelector(state => state.option.headerHeight)
    let bodyHeight = useSelector(state => state.option.bodyHeight)
    let userId = profile._id
    let [friendProfile, setFriendProfile] = useState({})
    let [friendId, setFriendId] = useState({})
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLike, setIsLike] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef(null);

    const chatHeader = useRef(null);
    const chatFooter = useRef(null);



    const chatHeaderHeight = chatHeader.current?.offsetHeight;
    const chatFooterHeight = chatFooter.current?.offsetHeight;


    const listContainerHeight = bodyHeight - headerHeight -chatHeaderHeight - chatFooterHeight


    let params = useParams()
    let profileId = params.profile;

    useEffect(() => {

        setTimeout(() => {
            document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });

        }, 1000);
        if (profileId === userId) return; // Prevent self-chat
        const newRoom = [userId, profileId].sort().join('_');
        setRoom(newRoom);
        socket.emit('startChat', { user1: userId, user2: profileId });

        socket.on('previousMessages', (msgs) => {
            setMessages(msgs);
        });

        socket.on('roomJoined', ({ room }) => {
            console.log(`Joined room: ${room}`);
            localStorage.setItem('roomId', room);
        });
        socket.on('newMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            document.querySelector('#chatMessageList .chat-message-container:last-child').scrollIntoView({ behavior: "smooth" });

        });

        return () => {
            socket.off('newMessage');
            socket.off('previousMessages');
        };
    }, [params]);


    useEffect(() => {
        api.get('/profile', {
            params: {
                profileId: profileId
            }
        }).then((res) => {
            console.log('data', res.data)
            setFriendProfile(res.data)
            setFriendId(res.data.id)
        }).catch(e => console.log(e))


    }, [params])


    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() && room) {
            socket.emit('sendMessage', { room, senderId: userId, receiverId: profileId, message: inputValue });
            setInputValue('')
            document.querySelector('#chatMessageList .chat-message-container:last-child')?.scrollIntoView({ behavior: "smooth" });

        }
    }

    const handleKeyPress = (event) => {
        console.log('kc', event.keyCode)
        if (event.key === "Enter") {
            handleSendMessage(event)
            setInputValue(""); // Clear input after action
        }
    };


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
    console.log(cmlStyles)

    return (
        <div>

            <div id="chatBox" style={{ height: `${bodyHeight - headerHeight}px` }}>
                <div ref={chatHeader} className='chat-header'>
                    <div className='chat-header-user'>
                        <div className='chat-header-profilePic'>
                            <UserPP profilePic={`${friendProfile.profilePic}`} profile={friendProfile._id} active></UserPP>
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
                                            <div key={index} className='chat-message-container message-sent'>

                                                <div className='chat-message-profilePic'>
                                                    <UserPP profilePic={`${friendProfile.profilePic}`} profile={friendProfile._id} active></UserPP>
                                                </div>
                                                <div className='chat-message'> {msg.message} </div>
                                                <div className='chat-message-options'>
                                                    <div className='chat-message-options-button reply'>
                                                        <i className="fas fa-reply"></i>
                                                    </div>
                                                    <div className='chat-message-options-button reply'>
                                                        <i className="fas fa-ellipsis-v"></i>
                                                    </div>
                                                </div>
                                                <div className='chat-message-seen-status'>
                                                    Seen
                                                </div>
                                            </div>
                                            :
                                            <div key={index} className='chat-message-container message-receive'>
                                                <div className='chat-message-options'>
                                                    <div className='chat-message-options-button reply'>
                                                        <i className="fas fa-reply"></i>
                                                    </div>
                                                    <div className='chat-message-options-button reply'>
                                                        <i className="fas fa-ellipsis-v"></i>
                                                    </div>
                                                </div>
                                                <div className='chat-message'> {msg.message}  </div>

                                                <div className='chat-message-seen-status'>
                                                    Seen
                                                </div>
                                            </div>



                                    )
                                })

                            }
                            {
                            }

                            {/* 
                            <div className='chat-message-container message-receive'>
                                <div className='chat-message-options'>
                                    <div className='chat-message-options-button reply'>
                                        <i className="fas fa-reply"></i>
                                    </div>
                                    <div className='chat-message-options-button reply'>
                                        <i className="fas fa-ellipsis-v"></i>
                                    </div>
                                </div>
                                <div className='chat-message'> Message Receive </div>

                                <div className='chat-message-seen-status'>
                                    Seen
                                </div>
                            </div> */}





                        </div>
                    </div>

                </div>

                <div ref={chatFooter} className="chat-footer">
                    <div className="new-message-container">

                        <div className='chat-new-attachment'>
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
                                <input onChange={handleInputChange} onKeyDown={handleKeyPress} placeholder='Send Message....' value={inputValue} className='new-message-input' />
                            </div>
                            <div className='message-action-button-container'>

                                {
                                    isLike ? <div className='message-action-button send-like'>
                                        <i className="fas fa-thumbs-up"></i>
                                    </div> : <div onClick={handleSendMessage} className='message-action-button send-message'>
                                        <i className="fas fa-paper-plane"></i>
                                    </div>
                                }


                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* <div className="chat-header">

            </div>
            <div className="chat-body">
                <div className='message-box-container'>
                    <div className='message-item'>
                        New Messge
                    </div>
                    <div className='message-item other'>
                        New Messge
                    </div>

                    {
                        messages.map((msg, index) => (
                            <div  className='message-item me' key={index} style={{ marginBottom: '5px' }}>
                                {msg.message}
                                {console.log(msg)}
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="chat-footer">
                <input type="text" className='messageInput' placeholder="Message..." onChange={(e) => {
                    setMessage(e.target.value)
                }
                } />
                <button className='submitBtn' onClick={handleSendMessage}> Send</button>
            </div> */}

        </div>
    );
};

export default Chat;