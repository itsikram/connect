import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../api/api';


const AccountSetting = () => {
    let [data, setData] = useState({})
    let handleInputChange = useCallback(async (e) => {
        let name = e.target.id;
        let value = e.target.value
        setData({
            ...data,
            [name]: value
        })
    })

    let handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (data.newPassword !== data.confirmPassword) {
            return alert('Your New password and Confirm Password is not same')
        }
        let res = await api.post('auth/changePass', data)

        if (res.status == 400) {
            return alert('Your Current password is invalid')
        }

        if (res.status == 200) {
            let updatedUser = JSON.stringify(res.data);
            localStorage.setItem('user', updatedUser)
            window.location.reload()
        }
    })

    return (
        <>
            <div className='profile-setting'>
                <div className='setting-field-container'>
                    <h3 className='text-center'>Account Settings</h3>

                    <form>
                        <h3 className='fs-4'>Change Password</h3>
                        <div className="form-group mb-2">
                            <label for="currentPassword">Current Password</label>
                            <input onChange={handleInputChange.bind(this)} type="password" className="form-control" id="currentPassword" placeholder="Current Password" />
                        </div>
                        <div className="form-group mb-2">
                            <label for="newPassword">New Password</label>
                            <input onChange={handleInputChange.bind(this)} type="password" className="form-control" id="newPassword" placeholder="New Password" />
                        </div>
                        <div className="form-group mb-2">
                            <label for="confirmPassword">Confirm Password</label>
                            <input onChange={handleInputChange.bind(this)} type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" />
                        </div>

                        <button type="submit" onClick={handleSubmit.bind(this)} className="btn btn-primary">Save Settings</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AccountSetting;
