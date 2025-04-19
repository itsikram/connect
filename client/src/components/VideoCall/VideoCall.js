import React, { useEffect, useState, useRef } from 'react';
import socket from '../../common/socket';
import ModalContainer from '../modal/ModalContainer';
import Peer from 'simple-peer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const VideoCall = ({ myId }) => {
    let [isVideoCall, setIsVideoCall] = useState(false)
    let myProfile = useSelector(state => state.profile)
    let params = useParams();
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
    const isMobile = useMediaQuery("(max-width: 768px)");

    let closeVideoCall = (e) => {
        setIsVideoCall(false)
    }

    const [stream, setStream] = useState();
    const [me, setMe] = useState('');
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState();

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();


    useEffect(() => {

        if (receivingCall) {
            return setIsVideoCall(true)
        }
    }, [receivingCall])

    useEffect(() => {

        socket.on('receive-call', (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });

        socket.on('videoCallEnd',(leaveVideoCall) => {
            setReceivingCall(false)
            setIsVideoCall(false)
            setCallAccepted(false)
        })

        return () => {
            socket.off('receive-call')
            socket.off('videoCallEnd')
        }

    }, [params]);

    useEffect(() => {

        if(isVideoCall == true ) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                // setStream(stream);
                if (myVideo.current) {
                    myVideo.current.srcObject = stream
                }
            });
        }

    })

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            if (myVideo.current) {
                myVideo.current.srcObject = stream
            }
        });
    },[])

    useEffect(() => {
        setMe(myProfile._id)
    }, [myProfile])


    const answerCall = () => {

        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });

        peer.on('signal', (data) => {
            socket.emit('answer-call', { signal: data, to: caller , name: myProfile.fullName});
        });

        peer.on('stream', (currentStream) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                setStream(stream);
                if (userVideo.current !== null) {
                    userVideo.current.srcObject = currentStream
                }
            });
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;

    };

    useEffect(() => {
        // if(!callAccepted) {
        //     stopCamera();
        // }
    },[params,callAccepted])
    const stopCamera = () => {
        const myStream = myVideo.current?.srcObject;
        if (myStream) {
            const tracks = myStream.getTracks();
            tracks.forEach(track => track.stop());
            myVideo.current.srcObject = null;
        }
        const userStream = userVideo.current?.srcObject;

        if (userStream) {
            const tracks = userStream.getTracks();
            tracks.forEach(track => track.stop());
            userVideo.current.srcObject = null;
        }
    };


    let endCall = () => {
        socket.emit('leaveVideoCall', caller)
        setCallAccepted(false);
        setIsVideoCall(false)
    }

    return (
        <div>
            <ModalContainer
                title="Video Call"
                style={{ width: isMobile ? '95%' : "600px", top: "50%" }}
                isOpen={isVideoCall || callAccepted}
                onRequestClose={closeVideoCall}
                id="videoCallModal"
            >
                <div style={{ padding: 0 }}>
                    {/* <h2 className='text-center text-primary'>Video Call</h2> */}
                    <p>
                        {
                            receivingCall && !callAccepted && 'Incoming Call...'
                        }
                    </p>
                    <div className='video-call-container'>
                        {<video playsInline muted ref={myVideo} className='receive-my-video' autoPlay style={{ width: '150px' }} />}
                        {<video playsInline ref={userVideo} className='receive-friends-video' autoPlay style={{ width: '100%' }} />}
                    </div>
                    <div className='call-buttons'>
                        <button onClick={endCall} className='call-button-ends call-button bg-danger'>
                            <i class="fa fa-phone"></i>
                        </button>
                        {!callAccepted && <button onClick={answerCall} className='call-button-receive call-button bg-success'>
                            <i class="fa fa-phone-volume"></i>
                        </button>}

                    </div>

                </div>
            </ModalContainer>
        </div>
    );
}

export default VideoCall;
