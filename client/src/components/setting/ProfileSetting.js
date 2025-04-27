import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileSuccess } from '../../services/actions/profileActions';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ProfileSetting = () => {
    let myProfile = useSelector(state => state.profile)
    let dispatch = useDispatch()

    let [settings, setSetings] = useState({
        firstName: '',
        surname: '',
        nickname: '',
        username: ''
    })

    useEffect(() => {

        if (!myProfile?.user) return;
        setSetings({
            firstName: myProfile.user.firstName || '',
            surname: myProfile.user.surname || '',
            nickname: myProfile.nickname || '',
            username: myProfile.username || ''
        })

    }, [myProfile])

    let handleInputChange = useCallback(async (e) => {
        setSetings({
            ...settings,
            [e.target.name]: e.target.value

        })
        console.log(settings)
    })

    let handleSubmitSettings = useCallback(async (e) => {
        e.preventDefault();
        let res = await api.post('/profile/update', settings)
        if (res.status === 200) {
            dispatch(getProfileSuccess(res.data))
            toast(
                <Link className="text-decoration-none text-secondary" to={`${''}`}>
                    <div style={{ color: "blue", fontWeight: "bold" }}>
                        <div className="row d-flex align-items-center">
                            <div className="col-3">
                                <img className="rounded-circle w-100" src={myProfile.profilePic} alt="ICS" />
                            </div>
        
                            <div className="col-9">
                                {myProfile.fullName && (<h3 className="text-success fs-4 mb-0">{myProfile.fullName}</h3>)}
                                <p className="text-small text-secondary fs-6 text-muted mb-0">{'Your Profile Updated Successfully'}</p>
                            </div>
                        </div>
                    </div>
                </Link>
        
            );
        }
    })

    return (
        <>
            <div className='profile-setting'>
                <div className='setting-field-container'>
                    <h3 className='text-center'>Profile Settings</h3>
                    <form>
                        <div className="form-group mb-2">
                            <label for="firstName">First Name</label>
                            <input type="text" onChange={handleInputChange.bind(this)} className="form-control" id="firstName" value={settings.firstName} name='firstName' placeholder="Enter Frist Name" />
                        </div>
                        <div className="form-group mb-2">
                            <label for="surname">Surname</label>
                            <input type="text" onChange={handleInputChange.bind(this)} className="form-control" value={settings.surname} id="surname" name='surname' placeholder="Enter Last Name" />
                        </div>
                        <div className="form-group mb-2">
                            <label for="username">Userame</label>

                            <div className='input-group'>
                                <div className='input-group-prepend'>
                                    <span className='input-group-text'>@</span>
                                </div>
                                <input type="text" className="form-control" value={settings.username} name='username' onChange={handleInputChange.bind(this)} id="username" aria-describedby="emailHelp" placeholder="Enter Username" />


                            </div>
                        </div>


                        <div className="form-group mb-2">
                            <label for="nickname">Nickname</label>

                            <input type="text" onChange={handleInputChange.bind(this)} value={settings.nickname} className="form-control" id="nickname" name='nickname' placeholder="Enter Nickname" />

                        </div>

                        <button type="submit" onClick={handleSubmitSettings.bind(this)} className="btn btn-primary">Save Settings</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ProfileSetting;
