import { createStore,compose,applyMiddleware,combineReducers } from "redux"
import profileReducer from "./services/reducers/profileReducer"
import thunk from 'redux-thunk'
import authReducer from "./store(unused)/authReducer";
import notificationReducer from './services/reducers/notificationReducer'
import optionReducer from "./services/reducers/optionReducer";
import messageReducer from "./services/reducers/messageReducer";

// redux windows extention
// const ReactReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__(): false

const rootReducer = combineReducers({
    profile: profileReducer,
    auth: authReducer,
    option: optionReducer,
    notification: notificationReducer,
    message: messageReducer
})
const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
    )
)

store.subscribe(() => {
    console.log(store.getState())
})
export default store