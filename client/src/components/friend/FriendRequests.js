import React,{Fragment, useEffect,useState} from "react";
import { Link } from "react-router-dom";
import FGI from "./FGI";
import api from "../../api/api";

let FriendRequests = () => {

    let [reqData,setReqData] = useState([])

    useEffect(() => {
        api.get('/friend/getRequest/').then((res)=> {
            console.log(res.data)
            setReqData(res.data)
        }).catch(e => {
            console.log(e)
        })
    },[])

    return(
        <Fragment>
            <div id="friends-container" >
                <div className="heading">
                    <h4 className="heading-title">Friend Requests</h4>
                    <Link to="/friends/requests" className="view-more-btn">See All</Link>
                </div>
                <div className="friend-grid-container">

                    {
                        reqData.map((req, key) => {
                            return <FGI key={key} id={req._id} profilePic={req.profilePic} fullName={req.user.firstName+ ' ' + req.user.surname} type="req"></FGI>
                        })
                    }

                    {
                        reqData.length === 0 && <h4 className="data-not-found text-center">You don't have any Friend Request to show</h4>
                    }


                    
                </div>
            </div>
        </Fragment>
    )
}



export default FriendRequests;