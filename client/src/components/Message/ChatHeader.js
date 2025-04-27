import React, { useState, useEffect, useCallback, useRef } from 'react';
import socket from '../../common/socket';
import UserPP from '../UserPP';
import { useSelector } from 'react-redux';
import * as faceapi from "face-api.js";
import { useParams, useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import Peer from 'simple-peer';
import ModalContainer from '../modal/ModalContainer';
import isMobile from '../../utils/isMobile';

const ChatHeader = ({ friendProfile, isActive, room, lastSeen }) => {
    const [emotion, setEmotion] = useState(false);
    const [myEmotion, setMyEmotion] = useState(false)
    const [friendId, setFriendId] = useState(false)
    const [stream, setStream] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [me, setMe] = useState('');
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState();
    const [isVideoCalling, setIsVideoCalling] = useState(false)
    const cameraVideoRef = useRef(null)
    const location = useLocation();
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();


    let settings = useSelector(state => state.setting)
    let profile = useSelector(state => state.profile)
    let profileId = profile._id

    let params = useParams()

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
    const startVideo = () => {

        if (settings.isShareEmotion === true) {
            if (!navigator.mediaDevices) return;

            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                cameraVideoRef.current.srcObject = stream;
            }).catch((err) => console.error("Error accessing webcam: ", err));
        }
    };

    const stopCamera = () => {
        const stream = cameraVideoRef.current?.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            cameraVideoRef.current.srcObject = null;
        }
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

    const loadModels = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        detectEmotions();
    };

    useEffect(() => {
        setMe(profile._id)
    }, [profile])

    useEffect(() => {

        socket.on('receive-call', (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });

        socket.on('videoCallEnd', (friendId) => {
            setReceivingCall(false)
            setIsVideoCalling(false)
            setCallAccepted(false)
        })

        return () => {
            socket.off('receive-call')
            socket.off('videoCallEnd')
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
                peer.signal(signal);

            }
        });

        connectionRef.current = peer;
    };


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

    let handleBumpBtnClick = useCallback((e) => {
        socket.emit('bump', friendProfile, profile)
    })


    useEffect(() => {
        if (room) {
            startVideo();
            loadModels();
        }

    }, [room, params]);


    useEffect(() => {
        stopCamera()
    }, [location])


    useEffect(() => {
        setFriendId(friendProfile._id)
        socket.emit('last_emotion', { friendId: friendProfile._id, profileId })

    }, [friendProfile])

    useEffect(() => {
        if (myEmotion && friendId) {
            socket.emit('emotion_change', { profileId, emotion: myEmotion, friendId })
        }
    }, [myEmotion, friendId])

    useEffect(() => {

        socket.on('emotion_change', (emotion) => {
            setEmotion(emotion)
        })

        socket.on('last_emotion', data => {
            setEmotion(data.lastEmotion && `Last: ${data.lastEmotion}`)
        })

        return () => {
            socket.off('emotion_change')
        }
    }, [emotion])





    return (
        <>

            {/* <div>
                <Webcam
                    audio={false}
                    ref={cameraVideoRef}
                    screenshotFormat="image/jpeg"
                    width={350}
                    videoConstraints={{
                        facingMode: "user", // or "environment" for rear camera on mobile
                    }}
                />
                <button>Capture photo</button>
            </div> */}
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
                    <div onClick={handleBumpBtnClick} className='bump-button action-button' title='bump'>
                        <i className="fas fa-record-vinyl"></i>
                    </div>
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

                <ModalContainer
                    title="Video Call"
                    style={{ width: isMobile ? '95%' : "600px", top: "50%" }}
                    isOpen={isVideoCalling || callAccepted}
                    onRequestClose={closeVideoCall}
                    id="videoCallModal"
                >
                    <div style={{ padding: 0 }}>
                        {<h2 className='text-center text-primary'>Video Call</h2>}
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

                    </div>
                </ModalContainer>



            </div>
            {
                settings.isShareEmotion === true && <video style={{ display: 'none' }} ref={cameraVideoRef} autoPlay muted width="600" height="400" />
            }

        </>
    );
}

export default ChatHeader;
