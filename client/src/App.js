import React, { Fragment, useEffect } from 'react'
import Main from './pages/Main'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css'
import './assets/css/style.scss'
import process from 'process';
import { useDispatch } from 'react-redux';
import { setLogin } from './services/actions/authActions';
import { useJwt } from 'react-jwt';
window.process = process;


function App() {
  let dispatch = useDispatch()
  const user = localStorage.getItem("user") || '{}'
  const userJson = JSON.parse(user)
  const { isExpired } = useJwt(userJson.accessToken)
  dispatch(setLogin(userJson.accessToken))

  useEffect(() => {

    if (isExpired) {
      dispatch(setLogin(undefined))

    }
  }, [isExpired])

  return (
    <Fragment>
      <Main />
      {/* {!isExpired && (<Main/>)}
        {isExpired && (<Login/>)} */}
    </Fragment>

  );
}

export default App;
