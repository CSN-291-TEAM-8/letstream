import React, {useState} from 'react';
import Video from '../Video/Video';
import VideoInfo from '../VideoInfo/VideoInfo';
import './VideoPlayer.css';
import RecommendedVideos from '../RecommendedVideos/RecommendedVideos';
import CircularProgress from '@material-ui/core/CircularProgress';

const VideoPlayer = () => {
    //Received as a prop from where req for data is made
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className='videoplayer'>
            <div className='videoplayer_videodetails'>
                <div className='videoplayer_video'>
                    {isLoading ? <CircularProgress className='loading' color='secondary'/> : <Video videoId={videoId} /> }
                </div>
                <div className='videoplayer_videoinfo'>
                    {!isLoading ? <VideoInfo
                                    title={videoInfo.snippet}
                                    description={videoInfo.description}
                                    publishedDate={videoInfo.publishedDate}
                                    channelTitle={videoInfo.channelTitle}
                                    channelImage={videoInfo.channelImage}
                                    viewCount={videoInfo.viewCount}
                                    likeCount={videoInfo.likeCount}
                                    dislikeCount={videoInfo.dislikeCount}
                                    subs={videoInfo.subs}
                                  /> : null
                    }
                </div>
            </div>
            <div className='videoplayer_suggested'>
                <RecommendedVideos />
            </div>
        </div>
    )
}

export default VideoPlayer;