import React, { Fragment, useState, useEffect, useRef } from "react";
import { Container, Col, Row } from 'react-bootstrap';
import StoryContainer from "../components/story/StoryContainer";
import StoryLists from "../components/story/StoryLists";
import SingleStory from "../components/story/SingleStory";
import api from "../api/api";
import $ from 'jquery'
import { useParams, useNavigate, Outlet } from "react-router-dom";

let Story = () => {

    let { storyId } = useParams();
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
                setStories(res.data)
            }
        })


    }, [storyId])

    function handleNextClick(e) {
        const currentIndex = stories.findIndex(story => story?._id === storyId)
        const nextStoryId = stories[currentIndex + 1]?._id || stories[currentIndex]._id;
        navigate(nextStoryId)

    }

    function handlePrevClick(e) {
        const currentIndex = stories.findIndex(story => story?._id === storyId)
        const prevStoryId = stories[currentIndex - 1]?._id || stories[currentIndex]._id;
        navigate(prevStoryId)
        storyContainer.current.scrollBy({ left: 300, behavior: 'smooth' })
    }

    return (
        <Fragment>
           <StoryContainer></StoryContainer>

        </Fragment>
    )

}

export default Story;

