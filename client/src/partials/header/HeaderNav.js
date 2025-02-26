import React,{Fragment} from "react";
import { Link,Outlet,NavLink } from 'react-router-dom';
import $ from 'jquery';


let HeaderNav = () => {

        // add active class on click
        let addActiveClass = (e) => {
            let target = e.currentTarget
            $(target).siblings().removeClass('active')
            $(target).addClass('active')
            $('.header-nav-menu-item').children().children().removeClass('primary-color fas')
            $('.header-nav-menu-item').children().children().addClass('fal')
    
            $(e.currentTarget).children().children().addClass('primary-color fas')
            $(e.currentTarget).children().children().removeClass('fal')
        }
    
    return (
        <Fragment>
            <div className="header-nav-menu-container">
                            <ul className="header-nav-menu">
                                <NavLink to="/" exact="true"  onClick={addActiveClass}  className="header-nav-menu-item" title="Home">
                                    
                                    <div className="header-nav-menu-icon">
                                    <i className="fal fa-home-alt "></i>
                                    </div>
                                    
                                    
                                </NavLink>
                                <NavLink to="/friends" onClick={addActiveClass} className="header-nav-menu-item" title="Friends"> 
                                    <div className="header-nav-menu-icon">
                                    <i className="fal fa-user-friends "></i>
                                    </div>
                                </NavLink>
                                <NavLink to="/watch" onClick={addActiveClass}  className="header-nav-menu-item" title="Videos"> 
                                    <div className="header-nav-menu-icon">
                                    <i className="fal fa-play-circle"></i>

                                    </div>
                                </NavLink>

                                <NavLink to="/message" onClick={addActiveClass}  className="header-nav-menu-item" title="Marketplace">
                                    <div className="header-nav-menu-icon">
                                    <i className="fal fa-envelope"></i>

                                    </div>
                                </NavLink>
                                <NavLink to="/groups" onClick={addActiveClass}  className="header-nav-menu-item" title="Groups"> 
                                    <div className="header-nav-menu-icon">
                                    <i className="fal fa-users-crown"></i>

                                    </div>
                                </NavLink>


                                
                                

                            </ul>
                        </div>
        </Fragment>
    )
}

export default HeaderNav