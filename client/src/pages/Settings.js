import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setModeShare,loadSettings } from '../services/actions/settingsActions';
import api from '../api/api';
const Settings = () => {
    let dispatch = useDispatch();
    let settings = useSelector(state => state.setting)

    let handleShareFaceModeChange = async (e) => {
        let isChecked = e.currentTarget.checked
        // alert(isChecked)
        let updateSetting = await api.post('setting/update',{isShareEmotion: isChecked})
        if(updateSetting.status == 200) {
            dispatch(loadSettings(updateSetting.data))
        }
    }

    return (
        <div>
            <div className='container py-3'>
                <div className='row bb'>
                    <div className='col'>
                        <h1 className='primary-color mb-3 py-0'> Settings Page</h1>

                    </div>
                </div>
                <div className='row py-3'>
                    <div className='col-md-3 br'>
                        <div className='setting-groups-container'>
                            <ul className='setting-groups'>
                                <li className='setting-groups-item active'>
                                    <Link to="/settings">
                                        <span>
                                            Profile
                                        </span>
                                        <span>
                                            <i className='fa fa-chevron-right'></i>
                                        </span>
                                    </Link>
                                </li>
                                <li className='setting-groups-item'>
                                    <Link to="/settings/privacy">

                                        <span>
                                            Privacy
                                        </span>
                                        <span>
                                            <i className='fa fa-chevron-right'></i>
                                        </span>
                                    </Link>
                                </li>
                                <li className='setting-groups-item'>
                                    <Link to="/settings/notification">

                                        <span>
                                            Notification
                                        </span>
                                        <span>
                                            <i className='fa fa-chevron-right'></i>
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='col-md-9'>

                        <div className='setting-field-container'>
                            <h3 className='text-center'>Profile Settings</h3>
                            <form>
                                <div className="form-group">
                                    <label for="username">Username</label>
                                    <input type="text" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter username" />
                                </div>
                                {/* <div className="form-group">
                                    <label for="exampleInputPassword1">Password</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                                </div> */}

                                <div className="form-check my-3">
                                <input checked={settings.isShareEmotion === true ? true: false} type="checkbox" onChange={handleShareFaceModeChange.bind(this)} className="form-check-input" id="exampleCheck1" />
                                    <label className="form-check-label" for="exampleCheck1">Share Face Mode</label>
                                    <br />
                                    <small id="emailHelp" className="form-text text-muted">We'll access your camera to recognize your mode by scanning your face</small>

                                </div>

                                <button type="submit" className="btn btn-primary">Save Settings</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
