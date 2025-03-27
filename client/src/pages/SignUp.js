import React,{Fragment,useState,useEffect} from "react";
import $ from 'jquery'
import api from "../api/api";






let SignUP = () => {
    let closeSignup = (e) => {
        let target = e.currentTarget;
        $(target).parents('.signup-container').fadeOut()
    }
    
    let [inputs,setInputs] = useState({})
    
    let handleChange = e => {
        let name = e.target.name;
        let value = e.target.value;
    
        setInputs(values=> {
            return {
                ...values,
                [name]: value
            }
        })

        
    }
    let [error,setError] = useState({})

    let handleSubmit = async(e)=> {

        try {

            api.post('/auth/signup',inputs).then(res=> {
        
                    if(res.status === 201) {
                        $('#signup-form input').val("");
                        $('.signup-container').fadeOut('fast');
                        window.location.href= "/"
                    }else {
                        setError(res.data)
                    }
        
                })


        }catch(e){
            console.log(e)
        }



    }



    return(
        <Fragment>
            <div className="signup-container">

                    <div id="signup-form">
                    <h1 className="text-center login-heading primary-color mb-3 fw-bold">ICS - Signup</h1>

                            <div className="forms-container">
                                <div className="full-name">
                                    <input onChange={handleChange} name="firstName" className="first-name field" type="text" placeholder="First Name" />
                                    <input name="surname" onChange={handleChange} className="surname field" type="text" placeholder="Surame" />

                                </div>
                                <input onChange={handleChange} name="email" className="email field" type="text" placeholder="Email address or phone number" />
                                <input onChange={handleChange} name="password" type="password" className="password field" placeholder="Password"/>
                                <input onChange={handleChange} name="DOB" className="dob field" type="text" placeholder="DD/MM/YYYY" />

                                <div className="gender-container">
                                    <div className="field-title">Gender</div>
                                    <div className="radio-container">
                                        <label htmlFor="genderMale">Male</label>
                                        <input onFocus={handleChange} type="radio" id="genderMale" name="gender" value="male"></input>
                                        <label htmlFor="genderFemale">Female</label>
                                        <input onFocus={handleChange} type="radio" name="gender" id="genderFemale" value="female"></input>
                                        <label htmlFor="genderCustom">Custom</label>
                                        <input onFocus={handleChange} type="radio" name="gender" id="genderCustom" value="custom"></input>
                                    </div>
                                </div>
                                <p style={{color: 'red'}}>{error.message}</p>
                                <input onClick={handleSubmit} type="submit" className="submit-button field" value="Sign UP"/>
                                
                                
                            </div>

                        <div onClick={closeSignup} className="login-button">
                            <i className="fa fa-arrow-alt-circle-left"></i> Login
                        </div>
                    </div>
                </div>
        </Fragment>
    )
}

export default SignUP;