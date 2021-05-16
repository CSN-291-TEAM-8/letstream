import React, { useEffect, useState } from 'react';
import Video from '../Video/Video';
import VideoInfo from '../VideoInfo/VideoInfo';
import './VideoPlayer.css';
//import RecommendedVideos from '../RecommendedVideos/Home';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from 'react-router';
import VideoCard2 from '../VideoCard/VideoCard2';

import Connect from '../../utils';
import Noresults from "../Noresults";
import VideoSkeleton from '../Videoskeleton';

const videoInfo = {
    title: "hello",
    description: "hello",
    createdAt: 151617171818181881,
    username: "pen bhakti",
    avatar: "",
    viewsCount: 9,
    likesCount: 12,
    dislikesCount: 2,
    subs: 22
}


const RecommendedVideos = ({ videos, loading }) => {


    if (loading) {
        return [{_id:1},{_id:2},{_id:3}].map(x =>
            <VideoSkeleton key={x._id} />
        )
   }
    if (videos) {
        if(videos.length>0)
        return videos.map(x =>
            <VideoCard2 video={x} key={x._id} />
        )
    }
    return <div></div>;

}

const VideoPlayer = () => {
    //Received as a prop from where req for data is made
    const [isLoading, setIsLoading] = useState(true);
    const [currentvideo, setCurrVideo] = useState({});
    const [recommendedload, setLoad] = useState(true);
    const [err, setVideoFetchErr] = useState({ title: "", text: "" })
    const [Videos, setVideos] = useState([]);
    const { videoId } = useParams();
    //console.log(VideoInfo);
    useEffect(() => {

        Connect("/video/getinfo/" + videoId).then(data => {
            setCurrVideo(data.video);
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
            setVideoFetchErr({ title: "Requested video could not be fetched", text: err.message });
        })
        Connect("/user/feed", { body: { limit: 5 } }).then(data => {
            setVideos(data.videos);
            setLoad(false);
        }).catch(err => {
            setLoad(false);        
            
            console.log(err.message, "Failed to fetch recommended videos");
        })
    }, []);


    return (

        <div className='videoplayer'>

            
                <div className='videoplayer_videodetails'>
                {!err.title ? (
                    <>
                    <div className='videoplayer_video'>
                        {isLoading ? <CircularProgress className='videoloading' color='secondary' /> : <Video videoId={"XCz83pAIeyo"} />}
                    </div>
                    <div className='videoplayer_videoinfo'>
                        {!isLoading && !err.title&&<VideoInfo
                            video={currentvideo}
                            videoId={videoId}
                        />
                        }
                    </div>
                    </>
                    ) : <Noresults title={err.title} text={err.text} center={true}/>}
                </div>
            {(recommendedload||Videos.length==0)?<div className='videoplayer_suggested' style={{marginRight:"-200px"}}>
               {!recommendedload&&Videos.length>0&&(<h3 className="videoplayer_h3">Suggested videos</h3>)}
                <RecommendedVideos videos={Videos} loading={recommendedload} />
            </div>:<div className='videoplayer_suggested'>
            {!recommendedload&&Videos.length>0&&(<h3 className="videoplayer_h3">Suggested videos</h3>)}
                <RecommendedVideos videos={Videos} loading={recommendedload} />
            </div>}
        </div>
    )
}

export default VideoPlayer;