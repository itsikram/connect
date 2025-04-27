import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../api/api';


const AccountSetting = () => {

    return (
        <>
            <div className='profile-setting'>
                <div className='setting-field-container'>
                    <h3 className='text-center'>Account Settings</h3>
                    <form>

                        <h3 className='fs-4'>Change Password</h3>
                        <div className="form-group mb-2">
                            <label for="currentPassword">Current Password</label>
                            <input type="password" className="form-control" id="currentPassword" placeholder="Current Password" />
                        </div>
                        <div className="form-group mb-2">
                            <label for="newPassword">New Password</label>
                            <input type="password" className="form-control" id="newPassword" placeholder="New Password" />
                        </div>
                        <div className="form-group mb-2">
                            <label for="confirmPassword">Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" />
                        </div>



                        <button type="submit" className="btn btn-primary">Save Settings</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AccountSetting;
