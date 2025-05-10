import React, { Fragment, useState, useEffect } from "react";
import logo from '../../assets/images/logo.png';
import { Link, Outlet, NavLink } from 'react-router-dom';
import $ from 'jquery';
import api from "../../api/api";
import UserPP from "../../components/UserPP";
const logo_src = 'https://programmerikram.com/wp-content/uploads/2025/05/ics_logo.png';


let HeaderLeft = () => {
  let [searchedUsers, setSearchedUsers] = useState([])
  let [hasSearchResult, setHasSearchResult] = useState(false)
  let [mobileSearchMenu, setMobileSearchMenu] = useState(false)
  let [searchQuery, setSearchQuery] = useState('')


  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);

    useEffect(() => {
      const media = window.matchMedia(query);
      const listener = (e) => setMatches(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
  };
  const isMobile = useMediaQuery("(max-width: 768px)");


  let onSearchFocus = () => {

    if (!isMobile) {
      $('.header-search-icon, .header-logo').hide();
      $('.header-search-back-container').fadeIn('slow')
      $('.header-search-icon, .header-logo-container').animate({
        left: '-10px',
        opacity: 0,
      }, 'fast');
      $('#header-search').css({
        width: '100%',
        display: 'block'
      })
    }


  }

  let onSearchFocusOut = () => {

    if (!isMobile) {

      $('.header-search-back-container').hide()
      $('.header-search-icon, .header-logo-container').animate({
        left: '0',
        opacity: 1
      }, 'fast');
      $('.header-search-icon, .header-logo').fadeIn();
      $('#header-search').css({
        width: 'auto',
        display: 'block'
      })
      // if(isMobile) {
      //   $('.header-search-icon').css('display', 'block !important');
      // }
    }
    // setMobileSearchMenu(false)
    // setSearchedUsers([])
    setSearchQuery('')


  }

  let handleKeyUp = async (e) => {
    if (searchQuery.length > 0) {
      let searchResult = await api.get('search/', {
        params: {
          input: searchQuery
        }
      })
      if (searchResult.status === 200) {
        setSearchedUsers(searchResult.data)
        setHasSearchResult(searchResult.data.length > 0)
      }
    } else {
      setSearchedUsers([])
      setHasSearchResult(false)

    }

  }

  let headerSearchIcon = (e) => {
    if (isMobile) {
      setMobileSearchMenu(!mobileSearchMenu)
      onSearchFocus()
    }
  }

  let handleBackButtonClick = (e) => {
    setMobileSearchMenu(false)
  }

  return (
    <Fragment>
      <div className="header-left">
        <div className="header-logo-container">
          <Link to="/">
            <img className="header-logo" src={logo_src} alt="logo"></img>
          </Link>



        </div>
        <div className="header-search-back-container">
          <i onClick={handleBackButtonClick} className="fal fa-arrow-left header-search-back-icon"></i>
        </div>
        <div className={`header-search-container ${mobileSearchMenu == true ? 'active-mobile' : ''}`}>

          <i className="fal fa-search header-search-icon" onClick={headerSearchIcon.bind(this)}></i>
          <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value) }} onBlur={onSearchFocusOut} onFocus={onSearchFocus} onKeyUp={handleKeyUp.bind(this)} id="header-search" type="search" placeholder="Search ICS"></input>

          {hasSearchResult && (
            <ul className="header-search-results">
              {searchedUsers && searchedUsers.map((item, index) => {

                return (
                  <li className="search-result-item" key={index} onClick={() => { setHasSearchResult(false); setMobileSearchMenu(false) }}>
                    <Link to={'/' + item._id}>
                      <div className="user-profile-pic">
                        <UserPP profilePic={item.profilePic} profile={item._id}></UserPP>
                      </div>
                      <div className="user-details">
                        {item.fullName}

                      </div>

                    </Link>
                  </li>
                )

              })}

              {searchedUsers.length === 0 && <p className="text-small text-muted mb-0 text-center">No Profile Found</p>}

            </ul>
          )}

        </div>
      </div>
    </Fragment>
  )
}

export default HeaderLeft;