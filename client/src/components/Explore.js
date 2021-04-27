import { CircularProgress } from '@material-ui/core';
import React from 'react';
import '../styles/Explore.css';
import VideoCard from './VideoCard';

const Explore = () => {
    return (
        <Wrapper>
            <div className="recommendedvideos">
                {isLoading ? <CircularProgress className="loading" color="secondary" /> : null}
                <div className="recommendedvideos_videos">
                    {
                        videoCards.map(item=>{
                            return (
                                <Link key = {item.videoId} to = {`/video/${item.videoId}`} >
                                <VideoCard key = {item.videoId} 
                                    title = {item.title}
                                    image = {item.image}
                                    views = {item.views}
                                    timestamp = {item.timestamp}
                                    channel = {item.channel}
                                    channelImage = {item.channelImage}
                                />
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </Wrapper>
    )
}

export default Explore;