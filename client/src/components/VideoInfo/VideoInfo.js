import React, { useEffect } from 'react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import Linkify from "react-linkify";
import Comments from "./Comments";
import ReplyIcon from '@material-ui/icons/Reply';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import './VideoInfo.css';
import { Avatar, CircularProgress } from '@material-ui/core';
import { timeSince } from '../../utils';
import { useHistory } from 'react-router';
import { SubscriberContext } from '../../utils/SubscriberContext';
import { subscribe } from '../../pages/suggestions';

const ItemRow = ({ Icon, title, isBold, onclicktype, Activities, videoId }) => {
    return <div className="videoinfo_item" onClick={() => Activities({ type: onclicktype, vid: videoId })}>
        {isBold ? <Icon color="secondary" /> : <Icon />}&nbsp;&nbsp;<div className="videoinfo_title">{isBold && title === 'SAVE' ? <span style={{ color: "#f50057" }}>SAVED</span> : title}</div>
    </div>
}

const VideoInfo = ({ video, videoId, Activities }) => {
    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );
    const [load, setsubloading] = React.useState(false);
    const [isSubscribed, setSubscribed] = React.useState(false);
    const { setsubscriber } = React.useContext(SubscriberContext);
    const history = useHistory();
    const setSubscription = ({ currentsubscriptions, err }) => {
        if (load) {
            return;
        }
        setsubloading(false);
        if (!err) {
            setSubscribed(!isSubscribed);
            setsubscriber(currentsubscriptions);
            localStorage.setItem("subscription", JSON.stringify(currentsubscriptions));
        }
    }
    const handleSubscribe = (channel) => {
        setsubloading(true);
        subscribe(channel, setSubscription);
    };
    useEffect(() => {
        if (video?.organiser?.isSubscribed) {
            setSubscribed(video.organiser.isSubscribed);
        }
        if (video.keywords)
            video.keywords[0].split(',').forEach(function (t) {
                video.title += (" | " + t);
            })
    }, [video]);

    if (!video) {
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
                    <ItemRow Icon={ThumbUpIcon} isBold={video.isLiked} title={video.likesCount} onclicktype="likevideo" Activities={Activities} videoId={videoId} />
                    <ItemRow Icon={ThumbDownIcon} isBold={video.isdisLiked} title={video.dislikesCount} onclicktype="dislikevideo" Activities={Activities} videoId={videoId} />
                    <ItemRow Icon={ReplyIcon} title='SHARE' Activities={Activities} onclicktype="sharevideo"/>
                    <ItemRow Icon={PlaylistAddIcon} isBold={video.isSaved} title='SAVE' onclicktype="savevideo" Activities={Activities} videoId={videoId} />
                    <ItemRow Icon={MoreHorizIcon} title='' onclicktype="moreoption" Activities={Activities}/>
                </div>
            </div>
            <hr />
            <div className="videoinfo_channel">
                <div onClick={() => history.push(`/user/${video.organiser._id}`)} style={{ cursor: "pointer" }}>
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
                {!video.isMyVideo && (isSubscribed ? <div className='btn unsubscribe-btn' onClick={() => handleSubscribe({ _id: video?.organiser?._id })}>
                    {!load ? "SUBSCRIBED" : <CircularProgress size={26} color="inherit" />}
                </div> : <div className='btn' onClick={() => handleSubscribe({ _id: video?.organiser?._id })}>
                    {!load ? "SUBSCRIBE" : <CircularProgress size={26} color="inherit" />}
                </div>)}
            </div>
            <div className='videoinfo_channeldesc'>
                <Linkify componentDecorator={componentDecorator}><p>{video.description}</p></Linkify>
            </div>
            <hr />
            <Comments video={video} />
        </div>
    )
}

export default VideoInfo;
