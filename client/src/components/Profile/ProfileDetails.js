import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Moment from "react-moment";

let ProfileDetails = (props) => {
    let settings = useSelector(state => state.setting)
    let profile = useSelector(state => state.profile)
    let [workPlaces, setWorkPlaces] = useState([])
    let [schools, setSchools] = useState([])
    let [presentAddress, setPresentAddress] = useState('')
    let [permanentAddress, setPermanentAddress] = useState('')
    useEffect(() => {
        if (settings?.workPlaces) {
            setWorkPlaces(profile?.workPlaces)
        }
    }, [settings])

    useEffect(() => {
        if (profile?.presentAddress) {
            setPresentAddress(profile.presentAddress)
        }
        if (profile?.permanentAddress) {
            setPermanentAddress(profile.permanentAddress)
        }
        if (profile?.schools) {
            setSchools(profile.schools)
        }
    }, [profile])

    return (
        <Fragment>
            <div id="profile-details-list" className="details-list">

                {
                    workPlaces.map((workplace, index) => {

                        return <div key={index} className="details-list-item">
                            <i className="fas fa-briefcase"></i>
                            <span>
                                {workplace?.designation} at <b>{workplace?.name}</b>
                            </span>
                        </div>
                    })
                }

                {
                    schools.map((school, index) => {

                        return (
                            <div className="details-list-item">
                                <i className="fas fa-graduation-cap"></i>
                                <span>
                                    Studied at <b>{school?.name} ({school?.degree})</b>
                                </span>
                            </div>
                        )
                    })
                }



                {
                    presentAddress ? (
                        <div className="details-list-item">
                            <i className="fas fa-home"></i>
                            <span>
                                Lives in <b>{presentAddress}</b>
                            </span>
                        </div>) : <></>
                }
                {
                    permanentAddress ? (
                        <div className="details-list-item">
                            <i className="fas fa-globe"></i>
                            <span>
                                From <b>{permanentAddress}</b>
                            </span>
                        </div>) : <></>
                }

                <div className="details-list-item">
                    <i className="fas fa-clock"></i>
                    <span>
                        Joined  <b><Moment format="MMMM YYYY">{profile?.user?.createdAt}</Moment></b>
                    </span>
                </div>

            </div>
        </Fragment>
    )
}


export default ProfileDetails;