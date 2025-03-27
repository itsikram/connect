import React, { Fragment, useState, useEffect, useRef } from "react";
import { Container, Col, Row } from 'react-bootstrap';

import StoryLists from "../components/story/StoryLists";
import SingleStory from "../components/story/SingleStory";
import api from "../api/api";
import $ from 'jquery'
import { useParams , useNavigate } from "react-router-dom";

let Story = () => {

    let {storyId} = useParams();
    // setting state to store posts data
    let [stories, setStories] = useState([])
    let storyContainer = useRef()
    let [match, setMatch] = useState(window.matchMedia('(max-width: 768px)').matches)
    const navigate = useNavigate();
    useEffect(() => {
        // window width 
        window.matchMedia("(max-width:768px)").addEventListener('change', (e) => {
            setMatch(e.matches)
        })

        api.get('/story/').then(res => {
            if (res.status === 200) {
                console.log('stories', res.data)
                setStories(res.data)
            }
        })


    }, [storyId])

    function handleNextClick(e) {
        const currentIndex = stories.findIndex( story => story._id === storyId)
        const nextStoryId = stories[currentIndex + 1]._id
        navigate(nextStoryId)

    }

    function handlePrevClick(e) {
        storyContainer.current.scrollBy({ left: 300, behavior: 'smooth' })
    }

    console.log(stories)
    return (
        <Fragment>
                <Container fluid className="story-container py-3">
                    <Row>
                        <Col md="3">
                            {!match && <StoryLists stories={stories}></StoryLists>}
                        </Col>

                        <Col md="6">

                                <div ref={storyContainer} className="story-content-container">

                                <SingleStory></SingleStory>

                                    <div className="nf-story-arrow-left" onClick={handlePrevClick.bind(this)} >
                                        <i className="fa fa-chevron-left"></i>
                                    </div>
                                    <div className="nf-story-arrow-right" onClick={handleNextClick.bind(this)} >
                                        <i className="fa fa-chevron-right"></i>
                                    </div>

                                </div>


                        </Col>

                    </Row>

                </Container>

        </Fragment>
    )

}

export default Story;