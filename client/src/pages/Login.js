import React, { Fragment, useState } from "react";
import SignUP from "./SignUp";
import $ from 'jquery'
import api from '../api/api'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom";
let Login = (props) => {

    let showSignup = (e) => {
        let target = e.currentTarget;
        $(target).parents('.login-container').siblings('.signup-container').fadeIn('fast')

    }

    let [inputs, setInputs] = useState({})

    let handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setInputs(values => {
            return {
                ...values,
                [name]: value
            }
        })

    }

    let [error, setError] = useState({})

    let handleSubmit = async (e) => {
        try {

            let res = await api.post('/auth/login', inputs)

            if (res.status === 202) {
                let user = JSON.stringify(res.data);
                localStorage.setItem('user', user)
                window.location.reload()

            } else {
                alert(res.data.message)
            }

        } catch (error) {
            console.log(error)
        }



    }




    return (
        <Fragment>
            <div id="login">
                <div className="login-container">
                    <div className="logo-container text-center">
                        <img src="https://programmerikram.com/wp-content/uploads/2025/05/ics_logo_out_transparent.png" alt="Connect Logo" />
                    </div>
                    <div id="login-form">
                        <h1 className="text-center login-heading primary-color mb-3 fw-bold">Connect - Login</h1>

                        <div className="forms-container">
                            <input onChange={handleChange} className="email" name="email" type="text" placeholder="Email address or phone number" />
                            <input onChange={handleChange} type="password" name="password" className="password" placeholder="Password" />
                            <p id="loginErrorMsg" style={{ color: 'red' }}>{error.message}</p>
                            <input type="submit" onClick={handleSubmit} className="submit-button" value="Login" />
                            <span className="forgot-password">
                                Forgotten password?
                            </span>

                        </div>

                        <div onClick={showSignup} className="create-account-button">
                            Create new account <i className="fa fa-arrow-alt-circle-right"></i>
                        </div>
                    </div>
                </div>

                <SignUP></SignUP>
            </div>
        </Fragment>
    )
}

export default Login;