import React,{Fragment, useEffect} from 'react'
import {Container,Row,Col} from "react-bootstrap";
import MessageList from "../components/Message/MessageList";
import MessageBody from '../components/Message/MessageBody';
import MessageOptions from '../components/Message/MessageOptions.';
const Message = () => {



    return (
        <Fragment>
            <div id={"message"}>
                <Container fluid>
                    <Row style={{minHeight: '400px'}}>
                        <Col md="3">
                            <MessageList></MessageList>
                        </Col>
                        <Col md="6">
                            <MessageBody>
                            
                            </MessageBody>
                        </Col>
                        <Col md="3">
                            <MessageOptions></MessageOptions>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Fragment>
    )
}


export default Message