import { GET_POSTS,REMOVE_POST,ADD_POST } from "../constants/postConsts";

export const getPosts = (posts) => {

    return {
        type: GET_POSTS,
        payload: posts
    }

}
export const removePost = (postId) => {
    return {
        type: REMOVE_POST,
        payload: {
            postId
        }
    }
}
export const addPost = (post) => {
    return {
        type: ADD_POST,
        payload: post
    }
}
