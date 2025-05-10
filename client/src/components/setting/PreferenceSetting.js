import React from 'react';

const PreferenceSetting = () => {
    return (
        <>
            <div className='profile-setting'>
                <div className='setting-field-container'>
                    <h3 className='text-center'>Preference Settings</h3>
                    <form>
                        <div className="form-group mb-2">
                            <label for="themeSettings">Theme Mode</label>
                            <select className='form-control' id='themeSettings'>
                                <option value='default'>Default</option>

                                <option value='dark'>Dark</option>
                                <option value='light'>Light</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary">Save Settings</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PreferenceSetting;
