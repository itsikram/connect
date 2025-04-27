import React, { Fragment, useState, useEffect } from "react";
import Watch from "../components/watch/Watch";
import api from "../api/api";
import { useSelector } from "react-redux";

const Video = () => {
    let myProfile = useSelector(state => state.profile)
    let myId = myProfile._id;
    const [watches, setWatches] = useState([])
    let loadData = async () => {
        let response = await api.get('watch/related', { params: { profile_id: myId } })
        if (response.status === 200) {
            setWatches(response.data)
        }
    }
    useEffect(() => {
        loadData()
    }, [])






    return (
        <Fragment>
            <div className="container my-3">
                <div className="row">
                    <div className="col-md-3">

                    </div>
                    <div className="col-md-6">
                        {
                            watches.length > 0 ? watches.map((video, i) => (
                                <Watch key={i} watch={video} type="watch" />
                            ))
                                :
                                <></>
                        }
                    </div>
                    <div className="col-md-3">

                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Video;