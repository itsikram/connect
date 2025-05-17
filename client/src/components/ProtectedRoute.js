import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useJwt } from 'react-jwt'
import { useNavigate, useLocation } from 'react-router-dom';
const ProtectedRoute = ({ children }) => {
    let { token } = useSelector(state => state.auth)
    let navigate = useNavigate()
    let location = useLocation()

    const { isExpired } = useJwt(token) || false

    useEffect(() => {

        if(!token || isExpired) {
            navigate('/login')
        }

    }, [token,location])
    return (
        <>
            {children}
        </>
    );
}

export default ProtectedRoute;

