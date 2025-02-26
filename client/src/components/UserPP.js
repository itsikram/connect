import React,{Fragment} from "react";
import profilePic from '../assets/images/ai.jpg';



let UserPP = (props) => {

    return (
        <Fragment>
            <div className='user-profile-img-container'>
                {
                    props.active && <div className='active-icon active'></div>
                }
                
                <div className='user-profile-img'>
                    <img src={props.profilePic || profilePic}></img>
                </div> 
             </div>
        </Fragment>
    )
}

export default UserPP;