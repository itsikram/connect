import React,{Fragment} from "react";

let ProfileDetails = (props) => {
    
    return(
        <Fragment>
            <div id="profile-details-list" className="details-list">
                            <div className="details-list-item">
                                <i className="fas fa-briefcase"></i>
                                <span>
                                    Developer at <b>Python Programming</b>
                                </span>
                            </div>
                            <div className="details-list-item">
                                <i className="fas fa-briefcase"></i>
                                <span>
                                    Works at <b>WordPress</b>
                                </span>
                            </div>
                            <div className="details-list-item">
                                <i className="fas fa-briefcase"></i>
                                <span>
                                    Works at <b>Fiverr</b>
                                </span>
                            </div>

                            <div className="details-list-item">
                                <i className="fas fa-graduation-cap"></i>
                                <span>
                                    Studied at <b>Govt. Haraganga College, Munshiganj</b>
                                </span>
                            </div>

                            <div className="details-list-item">
                                <i className="fas fa-graduation-cap"></i>
                                <span>
                                    Went to <b>Rancha Ruhitpur High School</b>
                                </span>
                            </div>

                            <div className="details-list-item">
                                <i className="fas fa-home"></i>
                                <span>
                                    Lives in <b>Munshiganj Sadar</b>
                                </span>
                            </div>
                            <div className="details-list-item">
                                <i className="fas fa-clock"></i>
                                <span>
                                    Joined  <b>June 2015</b>
                                </span>
                            </div>
                            
                        </div>
        </Fragment>
    )
}


export default ProfileDetails;