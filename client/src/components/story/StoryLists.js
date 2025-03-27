import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserPP from '../UserPP';
import moment from 'moment';

const StoryLists = (props) => {

    let [stories, setStories] = useState(props.stories);
    useEffect(() => {
        setStories(props.stories);
    })
    let { storyId } = useParams();
        let getMessageTime = (timestamp) => {
            const inputDate = moment(timestamp);
            const now = moment();
        
        
            // Format based on condition
            const formattedTime = inputDate.format("dddd, hh:mm A")
        
            return formattedTime;
        }

    return (
        <>
            <div className="story-list-container">

                {stories.map((singleStory, key) => {
                    return <Link to={'/story/'+singleStory._id} className='text-decoration-none story-link' key={key}>
                        <div className='story-list-item mb-2'>
                            <div className='d-flex justify-content-center align-items-center'>
                                <div className='story-pp-container text-end'>
                                    <UserPP profilePic={singleStory?.author?.profilePic} hasStory={true} profile={singleStory?.author._id}></UserPP>
                                </div>
                                <div className='story-info-container px-2'>
                                    <h2 className='author-name fs-5 mb-0'>{singleStory.author.user.firstName + ' ' + singleStory.author.user.surname} </h2>
                                    <span className='story-time text-mute text-small' >{getMessageTime(singleStory.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                    </Link>
                })}
            </div>

        </>
    )
}


export default StoryLists;