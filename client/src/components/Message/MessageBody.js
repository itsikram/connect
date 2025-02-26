import React, { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import Chat from '../../pages/Chat';
import { io } from 'socket.io-client'
import serverConfig from '../../config.json'


const URL = serverConfig.SERVER_URL
const socket = io.connect(URL)


const MessageBody = () => {

    let {profile} = useParams();
    useEffect(() => {

    },[])
    return (
        <Fragment>
            {!profile? <h2 className='text-center'>Select an user to start conversation</h2> : <Chat socket={socket}></Chat>}
            
            
        </Fragment>

    );
}

export default MessageBody;
