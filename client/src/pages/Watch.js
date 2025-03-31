import React, { Fragment ,useState,useEffect} from "react";
import Post from "../components/post/Post";
import api from "../api/api";
let Watch = () => {


    let [newsFeeds, setNewsFeed] = useState([])


    useEffect(() => {

        let loadData = async () => {

            let nfRes = await api.get('/post/newsFeed/')
            if (nfRes.status === 200) {
                setNewsFeed(nfRes.data)
                console.log(nfRes.data)
            }
        }
        loadData()

    },[])

    return (
        <Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        
                    </div>
                    <div className="col-md-6">
                        {
                            // newsFeeds.map((post, i) => (
                            //     <Post key={i} post={post} type="watch" />
                            // ))
                        }
                    </div>
                    <div className="col-md-3">

                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Watch;