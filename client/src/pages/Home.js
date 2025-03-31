import React, { Fragment, useState, useEffect, useRef } from "react";
import { Container, Col, Row } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import Ls from '../partials/sidebar/Ls';
import Rs from '../partials/sidebar/Rs';
import CreatePost from "../components/post/CreatePost";
import Post from '../components/post/Post'
import StoryCard from "../components/story/StoryCard";
import api from "../api/api";
import $ from 'jquery'
import { setLoading } from "../services/actions/optionAction";
import { useLocation } from "react-router-dom";


let Home = () => {
    // setting state to store window width
    let location = useLocation();
    let dispatch = useDispatch()
    let storyContainer = useRef()
    function scrollLeft(e) {
        storyContainer.current.scrollBy({ left: -300, behavior: 'smooth' })

    }

    function scrollRight(e) {
        storyContainer.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
    let [match, setMatch] = useState(window.matchMedia('(max-width: 768px)').matches)

    // setting state to store posts data

    let [newsFeeds, setNewsFeed] = useState([])
    let [stories, setStories] = useState([])

    let loadData = async () => {

        let nfRes = await api.get('/post/newsFeed/')
        if (nfRes.status === 200) {
            setNewsFeed(nfRes.data)
        }

        let strRes = await api.get('/story/')
        if (strRes.status === 200) {
            console.log('stories', strRes.data)
            setStories(strRes.data)
        }

        dispatch(setLoading(false))

    }

    useEffect(() => {
        dispatch(setLoading(true))

        // window width 
        window.matchMedia("(max-width:768px)").addEventListener('change', (e) => {
            setMatch(e.matches)
        })

        loadData()
        // fetching newsfeed posts

    }, [])

    return (
        <Fragment>
            <div id="home" className="home-page">
                <Container fluid>
                    <Row>
                        <Col md="3">
                            {!match && <Ls />}
                        </Col>

                        <Col md="6">

                        <CreatePost></CreatePost>

                            <div id="newsfeed-container" className="newsfeed-container">

                                {
                                    stories.length > 0 && (
                                        <div id="nf-story-container" >
                                            <div ref={storyContainer} className="nf-story-overflow-container">

                                                {
                                                    stories.length > 0 &&
                                                    stories.map(story => {
                                                        return <StoryCard key={story._id} data={story}></StoryCard>
                                                    })
                                                }
                                            </div>

                                            <div className="nf-story-arrow-left" onClick={scrollLeft.bind(this)} >
                                                <i className="fa fa-chevron-left"></i>
                                            </div>
                                            <div className="nf-story-arrow-right" onClick={scrollRight.bind(this)} >
                                                <i className="fa fa-chevron-right"></i>
                                            </div>

                                        </div>
                                    )
                                }



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