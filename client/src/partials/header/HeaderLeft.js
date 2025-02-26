import React,{Fragment} from "react";
import logo from '../../assets/images/logo.png';
import { Link,Outlet,NavLink } from 'react-router-dom';
import $ from 'jquery';



let HeaderLeft = () => {

    let onSearchFocus = () => {
        $('.header-search-icon, .header-logo').hide();
        $('.header-search-back-container').fadeIn('slow')
        $('.header-search-icon, .header-logo-container').animate({
            left: '-10px',
            opacity: 0,
          },'fast');
          $('#header-search').css({
            width: '100%',
            display: 'block'
          })
          
    }



    let onSearchFocusOut = () => {
        $('.header-search-back-container').hide()
        $('.header-search-icon, .header-logo-container').animate({
            left: '0',
            opacity: 1
          },'fast');
          $('.header-search-icon, .header-logo').fadeIn();
          $('#header-search').css({
            width: 'auto',
            display: 'inline'
          })
          
    }

    
    return (
        <Fragment>
                                    <div className="header-left">
                            <div className="header-logo-container">
                                <Link to="/">
                                    <img className="header-logo" src={logo} alt="logo"></img>
                                </Link>
                                
                                
            
                            </div>
                            <div className="header-search-back-container">
                              <i className="fal fa-arrow-left header-search-back-icon"></i>
                            </div>
                            <div className="header-search-container">
                                
                                <i className="fal fa-search header-search-icon"></i>
                                <input onBlur={onSearchFocusOut} onFocus={onSearchFocus} id="header-search" type="search" placeholder="Search ICS"></input>
                            </div>
                        </div>
        </Fragment>
    )
}

export default HeaderLeft;