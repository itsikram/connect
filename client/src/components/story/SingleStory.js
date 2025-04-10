import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserPP from '../UserPP';
import api from '../../api/api';



const SingleStory = (props) => {
    let { storyId } = useParams();
    let [story, setStory] = useState({})
    let [storyBg, setStoryBg] = useState({})
    let [commentText, setCommentText] = useState({})

    useEffect(() => {
        api.get('/story/single', { params: { storyId: storyId } }).then(res => {
            if (res.status == 200) {
                setStory(res.data)
                console.log(res.data)
            }
        }).catch(e => {
            console.log(e)
        })
    }, [storyId])

    useEffect(() => {
        const getAverageColor = (imageUrl) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Allow cross-origin image processing
            img.src = imageUrl;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let r = 0, g = 0, b = 0, count = 0;

                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];     // Red
                    g += data[i + 1]; // Green
                    b += data[i + 2]; // Blue
                    count++;
                }

                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);

                // Generate linear gradient
                const gradient = `linear-gradient(135deg, rgb(${r}, ${g}, ${b}) 0%, rgba(${r - 30}, ${g - 30}, ${b - 30}, 0.8) 100%)`;
                setStoryBg(gradient);
            };
        };

        if (story?.image) {
            getAverageColor(story.image);
        }
    }, [storyId, setTimeout(() => { }, [2000])]);
    

    useEffect(() => {

    },[])

    let handleStoryKeyUp = (e) => {
        let value = e.target.value;
        setCommentText(value)
        if(e.keyCode === 13) {
            alert('submit')
        }
    }

    return (
        <>

            {story == null ? (<p></p>) : (
                <div className='single-story-container'>
                    <div className='single-story' style={{ background: storyBg }}>
                        <div className='single-story-pp-container'>
                            {story.author && (<UserPP profilePic={story.author.profilePic} profile={story.author} hasStory={false} ></UserPP>)
                            }
                        </div>
                        <div className='single-story-image-container' style={{ background: `url(${story.image})` }} >
                            {/* <img src={story.image} alt='Story Image' className='single-story-image' />  */}
                        </div>
                    </div>
                    <div className='single-story-meta-container'> 
                        <div className={`single-story-reacts-buttons`}>
                            <div className='single-story-react-button'>

                            </div>
                        </div>
                        <div className={`single-story-comment-container`}>
                            <input type='text' className={`single-story-comment-input`} placeholder='Post a comment to this story' onKeyUp={handleStoryKeyUp.bind(this)}/>
                        </div>
                    </div>

                </div>
            )}

        </>
    )
}


export default SingleStory;