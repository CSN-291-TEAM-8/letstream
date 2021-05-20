import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import './VideoCard.css';
import { timeSince } from '../../utils';
import path from "path";
import SettingsIcon from '@material-ui/icons/Settings';
import PublicIcon from '@material-ui/icons/Public';
import GroupIcon from '@material-ui/icons/Group';

export const VisibilityIcon = ({type})=>{
  switch(type){
    case "public":
      return <PublicIcon style={{fontSize:"small",marginLeft:"5px"}}/>;
    case "custom":
      return <SettingsIcon style={{fontSize:"small",marginLeft:"5px"}}/>;
    case "sub-only":
      return <GroupIcon style={{fontSize:"small",marginLeft:"5px"}}/>;
    default:
      return "?";
  }
}
const VideoCard = ({url, _id,title, channel, views, timestamp, channelImage,description,visibility,keywords}) => {
  const [show,setShow] = React.useState(false);
   let dis = title;
   keywords[0].split(",").forEach(x=>{
      dis+=" | "+x+" "
   })
    return (
        <div className='videocard' key={_id}>
          {show?<video id={_id.toString()} className='videocard_video' src={url} muted={true} autoPlay onMouseOut={()=>{setShow(false)}}></video>:<img id={_id.toString()} alt="" className="videocard_video" src={url.replace(path.extname(url),".jpg")} onMouseOver={()=>{window.timeout = setTimeout(()=>setShow(true),700)}} onMouseOut={()=>{if(window.timeout){clearTimeout(window.timeout)}}}/>}
          <div className="videocard_info">
            <Avatar 
              className='videocard_avatar' 
              alt={channel} 
              src={channelImage} 
            />
            <div className="videocard_text" >
              <div className="videocard_title" title={dis}>{dis.length>25?dis.substring(0,25) + "...":dis}</div>
              <span className="videocard_des" title={description}>{description.length>35?description.substring(0,35) + "...":description}</span>
              <p className="videocard_channel">{channel}&nbsp;<VisibilityIcon type={visibility}/></p>
              <p className="videocard_view">{views} views • {timeSince(timestamp)} ago</p>
            </div> 
          </div>
        </div>
    )
}

export default VideoCard;
