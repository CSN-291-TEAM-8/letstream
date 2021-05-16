import React, { useEffect } from 'react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import Linkify from "react-linkify";
import Comments from "./Comments";
import ReplyIcon from '@material-ui/icons/Reply';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import './VideoInfo.css';
import { Avatar, Button } from '@material-ui/core';
import { timeSince } from '../../utils';

const ItemRow = ({Icon,title})=>{
    return <div className="videoinfo_item">
            <Icon/>&nbsp;&nbsp;<div className="videoinfo_title">{title}</div>
    </div>
}

const VideoInfo = ({video,videoId}) => {
    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );
    useEffect(()=>{
        if(video.keywords)
        video.keywords[0].split(',').forEach(function(t){
            video.title+=" |"+t;
        })
    },[video]);
    
    if(!video){
        return <div></div>;
    }
    
    return (
        <div className='videoinfo'>
            <div className='videoinfo_headline'>
                <h1>{video.title}</h1>
            </div>
            <div className='videoinfo_stats'>
                <p>{video.views} views • {timeSince(video.createdAt)} ago</p>
                <div className="videoinfo_likes">
                    <ItemRow Icon={ThumbUpIcon} title={video.likesCount} />
                    <ItemRow Icon={ThumbDownIcon} title={video.dislikesCount} />
                    <ItemRow Icon={ReplyIcon} title='SHARE' />
                    <ItemRow Icon={PlaylistAddIcon} title='SAVE' />
                    <ItemRow Icon={MoreHorizIcon} title='' />
                </div>
            </div>
            <hr />
            <div className="videoinfo_channel">
                <div>
                    <Avatar 
                        className='videoinfo_avatar' 
                        alt={video?.organiser?.username} 
                        src={video?.organiser?.avatar} 
                    />
                    <div className='videoinfo_channelinfo'>
                        <h3 className='videoinfo_channeltitle'>{video?.organiser?.username}</h3>
                        <p className='videoinfo_channelsubs'>{video?.organiser?.subscribersCount} subscribers</p>
                    </div>
                    
                </div>
                {!video.isMyVideo&&(video?.organiser?.isSubscribed?<div className='btn unsubscribe-btn'>
                    SUBSCRIBED
                </div>:<div className='btn'>
                    SUBSCRIBE
                </div>)}
            </div>
            <div className='videoinfo_channeldesc'>
            <Linkify componentDecorator={componentDecorator}><p>{video.description}</p></Linkify>
            </div>
            <hr/>
            <Comments video={video}/>
        </div>
    )
}

export default VideoInfo;
