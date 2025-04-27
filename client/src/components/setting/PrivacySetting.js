import React from 'react';

const PrivacySetting = () => {
    return (
        <>
            <div className='profile-setting'>
                <div className='setting-field-container'>
                    <h3 className='text-center'>Privacy Settings</h3>
                    <form>
                        <div className="form-group mb-2">
                            <label for="username">First Name</label>
                            <input type="text" className="form-control" id="firstName" name='firstName' placeholder="Enter Frist Name" />
                        </div>
                        <div className="form-group mb-2">
                            <label for="username">Last Name</label>
                            <input type="text" className="form-control" id="lastName" name='lastName' placeholder="Enter Last Name" />
                        </div>

                        <button type="submit" className="btn btn-primary">Save Settings</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PrivacySetting;
