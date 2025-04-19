import React, {Fragment,useEffect} from 'react'
import Main from './pages/Main'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css'
import './assets/css/style.scss'
import Login from './pages/Login';
import { useSelector,useDispatch } from 'react-redux';
import {useJwt} from 'react-jwt'
import process from 'process';
window.process = process;

function App() {

  let dispatch = useDispatch()
  // let myProfile = useSelector(state => state.profile)
  
  let user = localStorage.getItem("user") || '{}'
  let userJson = JSON.parse(user)
  let {isExpired} = useJwt(userJson.accessToken)


  return (
      <Fragment>
        {!isExpired && <Main/>}
        {isExpired && <Login/>}
      </Fragment>

  );
}

export default App;
