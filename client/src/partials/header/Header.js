import React,{Fragment,useState,useEffect,useRef} from "react";
import { Container,Row,Col } from "react-bootstrap";
import { Link,Outlet,NavLink } from 'react-router-dom';
import MegaMC from "../../components/MegaMC";
import HeaderLeft from "./HeaderLeft";
import HeaderNav from "./HeaderNav";
import HeaderRight from "./HeaderRight";
import Ls from "../sidebar/Ls";
import $ from 'jquery'
import {setHeaderHeight} from "../../services/actions/optionAction.js";

import { useDispatch } from "react-redux";

const Header = ()=> {    
    var dispatch = useDispatch();


    let headerRef = useRef(null);
    const [height,setHeight] = useState(null);
    dispatch(setHeaderHeight(height))


    $(window).on('scroll' ,(e) => {
        if(window.pageYOffset > 100) {
            $('#header').addClass('sticky-header')
            let headerHeight = $('#header').height()
            $('#main-container').css('padding-top',headerHeight)
            
        }else {
            $('#header').removeClass('sticky-header')
            $('#main-container').css('padding-top', 0)
        }
    })



    let [match,setMatch] = useState(window.matchMedia('(max-width: 768px)').matches)

    useEffect(()=>{    

        if(headerRef.current) {
            setHeight(headerRef.current?.offsetHeight)

        }
        window.matchMedia("(max-width:768px)").addEventListener('change',(e) =>{
            setMatch(e.matches)
        })
    },[])

    let headerMMClick = (e) => {
        let target = e.currentTarget;
        $(target).siblings('.header-mm-dropdown').show('fast');
        if($(target).hasClass('active') !== true){
            $(target).addClass('active');
            $(target).siblings('.header-mm-dropdown').show('fast');
        }else {
            $(target).removeClass('active');
            $(target).siblings('.header-mm-dropdown').hide('fast');
        }


        
    }


    let MenuButton = () => {
        return(
            <Fragment>
                <div onClick={headerMMClick} className="header-mm-button">
                    <i className="fa fa-bars"></i>
                </div>
            </Fragment>
        )
    }


    return(
        <Fragment>
        <header ref={headerRef} className="header" id="header">
            <Container className="header-container" fluid="xxl">
                <Row>
                    <Col className="d-flex align-items-center">

                        <HeaderLeft/>
                        
                    </Col>
                    <Col className="header-middle" md={6} xs={2}>
                        {!match &&<HeaderNav/>}
                        
                        {match && <MenuButton/>}
                        
                        <MegaMC className="header-mm-dropdown" style={{top: '100%',left: 0,width: '300px',backgroundColor: '#000'}}>
                            <Ls/>
                        </MegaMC>
                    </Col>

                    <Col className="header-right d-flex justify-content-end align-items-center" >
                        <HeaderRight/>
                    </Col>
                </Row>
            </Container>
        </header>
        <Outlet/>
        </Fragment>
        
        
    )
}

export default Header;