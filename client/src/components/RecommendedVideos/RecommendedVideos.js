import React, {useState} from 'react';
import VideoCard from '../VideoCard/VideoCard';
import './RecommendedVideos.css';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const RecommendedVideos = () => {
    //Received as a prop from where the req for the data is made
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className='recommendedvideos'>
            { isLoading ? <CircularProgress className='loading' color='secondary' /> : null }
            <div className="recommendedvideos_videos">
                {
                  videoCards.map(item => {
                    return (
                            <Link key={item.videoId} to={`/video/${item.videoId}`}>
                              <VideoCard 
                                title={item.title}
                                image={item.image}
                                views={item.views}
                                timestamp={item.timestamp}
                                channel={item.channel}
                                channelImage={item.channelImage}
                              />
                            </Link>
                    )
                  })
                }
            </div>
        </div>
    )
}

export default RecommendedVideos;