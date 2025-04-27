import React from 'react';

const NotificationSetting = () => {
    return (
        <>
            <div className='message-setting'>
                <div className='setting-field-container'>
                    <h3 className='text-center'>Notification Settings</h3>
                    <form>
                        {/* <div className="form-group mb-2">
                            <label for="username">First Name</label>
                            <input type="text" className="form-control" id="firstName" name='firstName' placeholder="Enter Frist Name" />
                        </div> */}

                        <div className="form-check form-switch my-3">
                            <input  type="checkbox"className="form-check-input" id="showTyping" />
                            <label className="form-check-label" for="showTyping">Show Typing</label>
                            <br />
                            <small id="emailHelp" className="form-text text-muted">It will show your typing message to your friends inbox without sending</small>

                        </div>


                        <div className="form-check form-switch my-3">
                            <input type="checkbox" className="form-check-input" id="shareEmotionCheck" />
                            <label className="form-check-label" for="shareEmotionCheck">Share Face Mode</label>
                            <br />
                            <small id="emailHelp" className="form-text text-muted">We'll access your camera to recognize your mode by scanning your face</small>

                        </div>

                        <button type="submit" className="btn btn-primary">Save Settings</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default NotificationSetting;
