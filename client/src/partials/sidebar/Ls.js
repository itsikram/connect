
import React, {Fragment}  from 'react';
import {Button,ButtonGroup} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import UserPP from '../../components/UserPP';
import serverConfig from '../../config.json'

let LeftSidebar = () => {
    let profileData = useSelector(state => state.profile)

    let userInfo = JSON.parse((localStorage.getItem('user')||'{}'))
    const profilePath = "/"+userInfo.profile+"/"



    return (
        <Fragment>
            <div id="left-sidebar" className='text-left'>
                <ul className="ls-nav-menu">
                    <li>
                        <Link to={profilePath} className='text-decoration-none'>
                            <div className='ls-nav-menu-item'>
                                <div className='ls-profile-img'>
                                    <UserPP profilePic={serverConfig.SERVER_URL+'image/uploads/'+profileData.profilePic}></UserPP>
                                </div> 
                                
                                <div className='ls-text user-name'>{profileData.user &&  profileData.user.firstName} {profileData.user && profileData.user.surname}</div>
                            </div>
                        </Link>
                        
                    </li>
                    <li>
                        <Link to="/friends/" className='text-decoration-none'>
                        <div className='ls-nav-menu-item'>
                            <div className='ls-icon lsi-friends'>
                                
                            </div>
                            <div className='ls-text'>
                            Find Friends
                            </div>
                        </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/groups/" className='text-decoration-none'>
                        <div className='ls-nav-menu-item'>
                            <div className='ls-icon lsi-group'>
                                
                            </div>
                            <div className='ls-text'>
                                Groups
                            </div>
                        </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/watch/" className='text-decoration-none'>
                        <div className='ls-nav-menu-item'>
                            <div className='ls-icon lsi-watch'>
                                
                            </div>
                            <div className='ls-text'>
                                Watch
                            </div>
                        </div>
                        </Link>
                    </li>
                    <li>
                    <Link to="/marketplace/" className='text-decoration-none'>
                        <div className='ls-nav-menu-item'>
                            <div className='ls-icon lsi-mp'>
                                
                            </div>
                            <div className='ls-text'>
                                Marketplace
                            </div>
                        </div>
                    </Link>
                    </li>
                    <li>
                        <div className='ls-nav-menu-item'>
                            <div className='ls-icon lsi-memo'>
                                
                            </div>
                            <div className='ls-text'>
                                Memories
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='ls-nav-menu-item'>
                            <div className='lsi-star'>
                                
                            </div>
                            <div className='ls-text'>
                                Favourites
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='ls-nav-menu-item'>
                            <div className='ls-icon lsi-pages'>
                                
                            </div>
                            <div className='ls-text'>
                                Pages
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='ls-nav-menu-item'>
                            <div className='ls-icon lsi-saved'>
                                
                            </div>
                            <div className='ls-text'>
                                Saved
                            </div>
                        </div>
                    </li>
                    
                    
                    
                    
                    <li>
                        <div className='ls-nav-menu-item'>
                            <div className='lsi-card'>
                                
                            </div>
                            <div className='ls-text'>
                                Orders & Payments
                            </div>
                        </div>
                    </li>

                </ul>
            </div>
        </Fragment>
    )
}

export default LeftSidebar;