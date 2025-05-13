import React, { useEffect, useState, useRef, useCallback } from 'react';
import socket from '../../common/socket';
import ModalContainer from '../modal/ModalContainer';
import Peer from 'simple-peer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useIsMobile from '../../utils/useIsMobile';
// import getRingtoneSrc from '../../utils/getRingtoneSrc';

import ringtones from '../../config/ringtones.json'


const VideoCall = ({ myId }) => {
    let [isVideoCall, setIsVideoCall] = useState(false)
    const mySettings = useSelector(state => state.setting)
    const [stream, setStream] = useState();
    const [callerName, setCallerName] = useState('');
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState();
    const [isMicrophone, setIsMicrophone] = useState(true);
    const [isBackCamera, setIsBackCamera] = useState(false);



    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const callEndBtn = useRef();
    const ringtoneAudio = useRef();

    const isMobile = useIsMobile();



    let stopRingtone = () => {
        ringtoneAudio?.current.pause();
    }

    let playRingtone = () => {
        setTimeout(() => {
            ringtoneAudio?.current.play();
        }, 500)
    }


    let closeVideoCall = e => {
        return;
    }

    useEffect(() => {
        if (mySettings.ringtone) {
            let ringtone = ringtones.filter(ringtone => ringtone.id == mySettings.ringtone)
            let toneSrc = ringtone.length > 0 ? ringtone[0]?.src : "no ring tone"
            ringtoneAudio?.current.setAttribute('src', toneSrc)
        }
    }, [mySettings])

    useEffect(() => {

        if (receivingCall) {

        }

    }, [receivingCall])



    useEffect(() => {

        socket.on('receive-call', (data) => {
            setIsVideoCall(true)
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
            setCallerName(data.name)
            playRingtone();
        });

        socket.on('videoCallEnd', (leaveVideoCall) => {
            stopRingtone();
            let mouseEevent = new MouseEvent('click', { bubbles: true, cancelable: false })
            if (callEndBtn.current) {
                callEndBtn.current.dispatchEvent(mouseEevent)
            }
        })
        return () => {
            socket.off('receive-call')
            socket.off('videoCallEnd')
        }
    }, []);

    useEffect(() => {
        if (isVideoCall == true) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    const videoDevices = devices.filter(device => device.kind === "videoinput");
                    const backCamera = videoDevices.find(device => device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("environment"));

                    return navigator.mediaDevices.getUserMedia({
                        video: { deviceId: isBackCamera && backCamera?.deviceId || videoDevices[0].deviceId },
                        audio: isMicrophone
                    }).then((stream) => {
                        setStream(stream);
                        if (myVideo.current) {
                            myVideo.current.srcObject = stream;
                        }
                    });
                })

        }
    }, [isVideoCall])



    const answerCall = () => {
        stopRingtone();
        if (!callerSignal) {
            console.warn("No caller signal to answer");
            return;
        }
        setCallAccepted(true);

        const peerB = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        peerB.on('signal', (data) => {
            socket.emit('answer-call', { signal: data, to: caller });
        });

        peerB.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        // Make sure signal is only called once
        try {
            if (!peerB.destroyed) {
                peerB.signal(callerSignal);
            }
        } catch (err) {
            console.error("Failed to apply caller signal:", err);
        }

        if (connectionRef?.current) {
            connectionRef.current = peerB;

        }

    };


    useEffect(() => {
        socket.on('leaveVideoCall', data => {
            if (connectionRef?.current) {
                connectionRef.current.destroy();
                connectionRef.current = null;
            }
        })

    }, [])


    let endCall = useCallback(() => {
        stopRingtone();

        socket.emit('leaveVideoCall', caller)
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }

        if (myVideo.current) {
            myVideo.current.srcObject = null;
        }
        if (userVideo.current) {
            userVideo.current.srcObject = null;
        }

        setStream(null)
        setCallAccepted(false);
        setIsVideoCall(false)
        if (connectionRef?.current) {
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
    })

    let handleMicrophoneClick = useCallback(() => {

        setIsMicrophone(!isMicrophone)
    })

    let handleSwitchClick = useCallback(() => {
        setIsBackCamera(!isBackCamera)
    })



    return (
        <div>
            <ModalContainer
                title="Video Call"
                style={{ width: isMobile ? '95%' : "600px", top: "50%" }}
                isOpen={isVideoCall}
                onRequestClose={closeVideoCall}
                id="videoCallModal"
            >
                <div className={`${callAccepted ? 'call-accepted' : ''}`} style={{ padding: 0 }}>
                    <h2 className='text-center vc-modal-heading'>Video Call - {callerName}</h2>

                    <p className='fs-4 text-center'>
                        {
                            receivingCall && !callAccepted && `${callerName} Calling you`
                        }
                    </p>
                    <div className={`video-call-container ${isMobile ? 'mobile' : ''}`}>
                        {callAccepted && <video playsInline ref={userVideo} className='receive-friends-video' autoPlay style={{ width: '100%' }} />}
                        {<video playsInline muted ref={myVideo} className='receive-my-video' autoPlay style={{ width: '150px' }} />}

                    </div>
                    <div className='call-buttons'>

                        <button onClick={endCall} ref={callEndBtn} className='call-button-ends call-button bg-danger'>
                            <i className="fa fa-phone"></i>
                        </button>
                        {
                            callAccepted && <>
                                <button onClick={handleMicrophoneClick.bind(this)} className='call-button-microphone call-button'>
                                    {
                                        isMicrophone ? <i className="fa fa-microphone"></i> : <i class="fa fa-microphone-slash"></i>
                                    }
                                </button>
                                <button onClick={handleSwitchClick.bind(this)} className='call-button-switch call-button'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                        <path d="M11 7H5a2 2 0 0 0-2 2v4" />
                                        <path d="M13 17h6a2 2 0 0 0 2-2v-4" />
                                        <polyline points="16 3 21 3 21 8" />
                                        <polyline points="8 21 3 21 3 16" />
                                        <path d="M21 3l-6.5 6.5" />
                                        <path d="M3 21l6.5-6.5" />
                                    </svg>

                                </button>


                            </>
                        }

                        {!callAccepted && <button onClick={answerCall.bind(this)} className='call-button-receive call-button bg-success'>
                            <i className="fa fa-phone-volume"></i>
                        </button>}

                    </div>

                </div>
            </ModalContainer>
            <audio ref={ringtoneAudio} loop />
        </div>
    );
}

export default VideoCall;
