import React from 'react';
import SideBarRow from './../SideBarRow/SideBarRow';
import './SideBarMain.css';
import HomeIcon from '@material-ui/icons/Home';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import PeopleIcon from '@material-ui/icons/People';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import HistoryIcon from '@material-ui/icons/History';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
//import WatchLaterIcon from '@material-ui/icons/WatchLater';
import LiveTvOutlinedIcon from '@material-ui/icons/LiveTvOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
//import { MdSubscriptions } from 'react-icons/md';
import { SubscriberContext } from '../../../../utils/SubscriberContext';


//fetch subscribers

const SideBarMain = ({selectedTitle}) => {
    const {subscriber} = React.useContext(SubscriberContext);
    // if(localStorage.getItem("subscription")){
    //     setSubscription();
    // }
    return (
        <div className='sidebar'>
            <SideBarRow key={1} selected={selectedTitle==='Home'} Icon={HomeIcon} title='Home' url={"/"}/>
            <SideBarRow key={11} selected={selectedTitle==='Trending'} Icon={WhatshotIcon} title='Trending' url={"/highlight"}/>
            <SideBarRow key={12} selected={selectedTitle==='Suggestions'} Icon={PeopleIcon} title='Suggestions' url={"/user/suggestions"} />
            <hr />
            
            <SideBarRow key={13} selected={selectedTitle==='History'} Icon={HistoryIcon} title='History' url={"/user/history"}/>
            <SideBarRow key={14} selected={selectedTitle==='Your videos'} Icon={OndemandVideoIcon} title='Your videos' url={"/user/myvideos"}/>   
            <SideBarRow key={15} selected={selectedTitle==='Saved videos'} Icon={BookmarksIcon} title='Saved Videos' url={"/user/savedvideos"}/>         
            <SideBarRow key={16} selected={selectedTitle==='Liked videos'} Icon={ThumbUpIcon} title='Liked videos' url={"/user/likedvideos"} />
            <SideBarRow key={17} selected={selectedTitle==='Live videos'} Icon={LiveTvOutlinedIcon} title="Live videos" url={"/user/livevideos"}/>
            <hr />
            <h3 className="h3-sidebar">SUBSCRIPTIONS</h3>
            {subscriber?.map((s)=><SideBarRow key={s.username} avatar={s.avatar} title={s.username} url={`/user/${s._id}`}/>)}
           
        </div>
    )
}

export default SideBarMain;
