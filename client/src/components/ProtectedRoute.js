import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useJwt } from 'react-jwt'
import { setLogin } from '../services/actions/authActions';
import { useNavigate, useLocation } from 'react-router-dom';
const ProtectedRoute = ({ children }) => {
    let { token } = useSelector(state => state.auth)
    let navigate = useNavigate()
    let location = useLocation()

    const { isExpired } = useJwt(token) || false

    useEffect(() => {

        if(!token) {
            navigate('/login')
        }

    }, [token])
    return (
        <>
            {children}
        </>
    );
}

export default ProtectedRoute;

