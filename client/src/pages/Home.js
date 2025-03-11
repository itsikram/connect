import React,{Fragment,useState,useEffect} from "react";
import {Container,Col,Row} from 'react-bootstrap';

import Ls from '../partials/sidebar/Ls';
import Rs from '../partials/sidebar/Rs';
import CreatePost from "../components/post/CreatePost";
import Post from '../components/post/Post'
import api from "../api/api";


let Home = () => {

    // setting state to store window width

    let [match,setMatch] = useState(window.matchMedia('(max-width: 768px)').matches)
           
    // setting state to store posts data

    let [newsFeeds,setNewsFeed] = useState([])

    useEffect(()=>{


        // window width 
        window.matchMedia("(max-width:768px)").addEventListener('change',(e) =>{
            setMatch(e.matches)
        })


        // fetching newsfeed posts
        api.get('/post/newsFeed/').then(res => {
            if(res.status === 200) {
                setNewsFeed(res.data)
            }
        })


    },[])
    
    return (
        <Fragment>
            <div id="home" className="home-page">
                <Container fluid>
                    <Row>
                        <Col md="3">
                            {!match && <Ls/>}
                        </Col>

                        <Col md="6">

                            <div id="newsfeed-container" className="newsfeed-container">
                                
                                
                                <div className="nf-story"></div>
                                <CreatePost></CreatePost>


                                <div id="nf-post-container">
                                    
                                    {
                                        newsFeeds.map(newsFeed => {
                                            return <Post key={newsFeed._id} data={newsFeed}></Post>
                                        })
                                    }
                                    
                                </div>

                            </div>                     

                        </Col>


                        <Col md="3">
                            {!match && <Rs></Rs>}
                            
                        </Col>

                    </Row>

                </Container>
            </div>


        </Fragment>
    )

}

export default Home;