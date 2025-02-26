import { createStore,compose,applyMiddleware,combineReducers } from "redux"
import profileReducer from "./services/reducers/profileReducer"
import thunk from 'redux-thunk'
import authReducer from "./store/authReducer";

// redux windows extention
// const ReactReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__(): false

const rootReducer = combineReducers({
    profile: profileReducer,
    auth: authReducer
})
const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
    )
)
export default store