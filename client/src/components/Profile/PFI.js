import React,{Fragment} from 'react';
import $ from 'jquery'
import serverConfig from '../../config.json'
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { useSelector } from 'react-redux';


const PFI = (props) => {
    let friend = props.friend
    let myProfile = useSelector(state => state.profile)

    let isFriend = myProfile.friends && myProfile.friends.includes(friend._id)
    let isMe = myProfile._id === friend._id

    let friendFullName = friend.user && friend.user.firstName + " " + friend.user.surname

    let handleFrndOptionClick = (e) => {
        let target = e.currentTarget

        $(target).children('.friend-options-menu').toggle()
    }

    let clickRemoveFrndOption = async(e) =>{
 

        try {
            

            let res = await api.post('/friend/removeFriend',{
                profile: friend._id
            })
            $(e.currentTarget).parents('.friend-item').fadeOut()

            
        } catch (error) {
            console.log(error)
        }



    }

    let clickAddFrndOption = async(e) => {
        try {

            let target = e.currentTarget
            await api.post('/friend/sendRequest/',{profile: friend._id})
            $(target).parents('.friend-item').hide()

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <div className='friend-item'>

                <div className='friend-info'>
                    <Link to={'/'+friend._id}>
                        <div className='friend-profilePic'>
                            <img src={`${serverConfig.SERVER_URL}image/uploads/${friend.profilePic}`} alt={friendFullName} ></img>
                        </div>
                        <div className='friend-details'>
                            <h4 className='friend-name text-capitalize'>{friendFullName}</h4>
                            {
                                friend.mutual &&  <span className='friend-mutual'> 20 Mutual Friends</span>
                            }
                            
                        </div>
                    </Link>


                </div>
                <div className='friend-options' onClick={handleFrndOptionClick}>
                <i className='far fa-ellipsis-h'></i>

                    <div className='friend-options-menu'>
                        {
                            isFriend? 
                            <div onClick={clickRemoveFrndOption} className='friend-options-menu-item'>
                                <div className='menu-item-icon'>
                                <i className="fas fa-user-times"></i>
                                </div>
                                <div className='menu-item-text'>Remove Friend</div>
                            </div> 
                        
                        :
                            <div onClick={clickAddFrndOption} className='friend-options-menu-item'>
                                <div className='menu-item-icon'>
                                <i className="fas fa-user-plus"></i>
                                </div>
                            <div className='menu-item-text'>Add Friend</div>
                        </div>
                        }
                        
                    </div>
                    
                </div>
                </div>
        </div>
    );
}

export default PFI;
