import React, { useState } from 'react';
import VideoCard from '../VideoCard/VideoCard';
import './RecommendedVideos.css';
import { Link } from 'react-router-dom';
import { Connect } from "../../utils";
import CircularProgress from '@material-ui/core/CircularProgress';
//import {Videos} from '../../assets/getVideo';
import SideBarMain from '../Sidebar/Main/SideBarMain/SideBarMain';
import NoResults from '../Noresults';
import { SubscriberContext } from '../../utils/SubscriberContext';

export const Loader = ({center}) => {
    return center?<center><CircularProgress color='secondary'/></center>:<CircularProgress className='circular_loading' color='secondary'/>
}

const RecommendedVideos = () => {
    //Received as a prop from where the req for the data is made
    const { setsubscriber } = React.useContext(SubscriberContext);
    const [isLoading, setisLoading] = useState(true);
    const [error, setErr] = useState({ text: null, title: null });
    const [Videos, setVideos] = useState([]);
    React.useEffect(() => {
        Connect("/user/feed", { method: "POST" }).then(data => {
            if (data.subscribedto) {
                localStorage.setItem("subscription", JSON.stringify(data.subscribedto));
                setsubscriber(data.subscribedto);
            }
            setVideos(data.videos);
            if (data.videos.length === 0) {
                setErr({ title: "No videos found", text: "There is nothing to show here" });
            }
            setisLoading(false);
        }).catch(err => {
            setErr({ text: err.message, title: "Error in loading page" });
            setisLoading(false);
        })
    }, [])
    if (error.text) {
        return (
            <>
                <SideBarMain selectedTitle="Home" style={{ marginTop: "100px" }} />
                <div className='recommendedvideos'>
                    <NoResults
                        title={error.title}
                        text={error.text}
                    />
                </div>
            </>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            <SideBarMain selectedTitle="Home" />
            <div className='recommendedvideos'>
                {isLoading ? <Loader /> :
                    <div className="recommendedvideos_videos">
                        {
                            Videos.map(item => {
                                return (
                                    <Link key={item._id} to={`/video/${item._id}`}>
                                        <VideoCard
                                            title={item.title}
                                            keywords={item.keywords}
                                            _id={item._id}
                                            description={item.description}
                                            visibility={item.visibility}
                                            url={item.url}
                                            views={item.views}
                                            timestamp={item.createdAt}
                                            channel={item.organiser.username}
                                            channelImage={item.organiser.avatar}
                                        />
                                    </Link>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default RecommendedVideos;