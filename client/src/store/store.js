import api from "../api/api";
import {createStore, applyMiddleware,compose} from 'redux'
import thunk from "redux-thunk";

//constants

const GET_USER_REQUEST = 'GET_USER_REQUEST'
const GET_USER_SUCCSESS ="GET_USER_SUCCSESS"
const GET_USER_FAILED = 'GET_USER_FAILED'

// user actions

const initialState = () => {
    return {
        isLoading: false,
        user: {},
        error: {}
    }
}

const getUserRequest = (user) => {
    return {
        type: GET_USER_REQUEST
    }
}

const getUserSuccsess = (user) => {
    return {
        type: GET_USER_SUCCSESS,
        payload: user
    }
}

const getUserFailed = (error) => {
    return {
        type: GET_USER_FAILED,
        payload: error
    }
}


// user reducers

const userReducer = (state=initialState,action) => {
    switch (action.type) {
        case GET_USER_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case GET_USER_SUCCSESS:
            return {
                ...state,
                isLoading:false,
                user: action.payload
            }
        case GET_USER_FAILED:
            return {
                ...state,
                error: action.payload,
                isLoading: false

            }
    
        default:
            return state;
    }
}

const ReactReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(userReducer,compose(applyMiddleware(thunk),ReactReduxDevTools))

store.subscribe = () => {
    console.log(store.getState())
}

// fetching data
const fetchData = () => {
    return (dispatch) => {
        dispatch(getUserRequest())

        api.get('/profile').then(res => {
            console.log(res.data)
            dispatch(getUserSuccsess(res.data.user))
        }).catch(error => {
            dispatch(getUserFailed(error.message))
        })
    }

}

store.dispatch(fetchData())

export default store