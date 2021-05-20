import React from 'react';
import './VideoCard.css';
import { timeSince } from '../../utils';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import SettingsIcon from '@material-ui/icons/Settings';
import PublicIcon from '@material-ui/icons/Public';
import GroupIcon from '@material-ui/icons/Group';
import path from "path"

const VideoCard2 = ({url, _id,title, channel, views, timestamp, likesCount,dislikesCount,description,visibility,noHoverplay,video,ClickListenEvent,live}) => {
  const [show,setShow] = React.useState(false);
  if(live){
    return (
      <div className='videocard2'>
          <img className="videocard_video" src={url} alt=""/>
          <div className="videocard2_info">
            
            <div className="videocard_text" >
              <div className="videocard_title" style={{display:"flex",flexWrap:"nowrap",alignItems:"center"}} title={title}>{title.length>25?title.substring(0,25) + "...":title} <div style={{display:"flex",paddingLeft:"20px"}}>{visibility==="public"&&<PublicIcon/>}
              {visibility==="sub-only"&&<GroupIcon/>}
              {visibility==="custom"&&<SettingsIcon/>}</div></div>
              <span className="videocard_des" title={description}>{description.length>35?description.substring(0,35) + "...":description}</span>
              <p className="videocard_channel">Organised by {channel}</p>
              <p className="videocard_view">{views} participants • {timeSince(timestamp)} ago</p>
              
            </div> 
          </div>
        </div>
    )
  }
  if(noHoverplay){
    return (
      <div className='videocard2'>
          <img alt="" className="videocard_video" src={video.url.replace(path.extname(video.url),".jpg")}/>
          <div className="videocard2_info">
            
            <div className="videocard_text" >
              <div className="videocard_title" title={video.title}>{video.title.length>25?video.title.substring(0,25) + "...":video.title}</div>
              <span className="videocard_des" title={video.description}>{video.description.length>35?video.description.substring(0,35) + "...":video.description}</span>
              <p className="videocard_channel">Uploaded by {video.channel}</p>
              <p className="videocard_view">{video.views} views • {timeSince(video.timestamp)} ago</p>
              <div className="likeinfo"><div>{video.likesCount}&nbsp;&nbsp;<ThumbUpIcon/></div>  <div>{video.dislikesCount}&nbsp;&nbsp;<ThumbDownIcon/></div><div>{video.visibility==="public"&&<PublicIcon/>}
              {video.visibility==="sub-only"&&<GroupIcon/>}
              {video.visibility==="custom"&&<SettingsIcon/>}</div></div>
            </div> 
          </div>
        </div>
    )
  }
  if(video){    
      return (
        <div className='videocard2'>
            <div>{show?<video className='videocard_video' src={video.url} muted={true} autoPlay onMouseOut={()=>{setShow(false)}}></video>:<img alt="" className="videocard_video" src={video.url.replace(path.extname(video.url),".jpg")} onMouseOver={()=>{window.timeout = setTimeout(()=>{setShow(true)},700)}} onMouseOut={()=>{if(window.timeout){clearTimeout(window.timeout)}}}/>}</div>
            <div className="videocard2_info">
              
              <div className="videocard_text" >
                <div className="videocard_title" title={video.title}>{video.title.length>25?video.title.substring(0,25) + "...":video.title}</div>
                <span className="videocard_des" title={video.description}>{video.description.length>35?video.description.substring(0,35) + "...":video.description}</span>
                <p className="videocard_channel">Uploaded by {video.organiser.username}</p>
                <p className="videocard_view">{video.views} views • {timeSince(video.createdAt)} ago</p>
                <div className="likeinfo"><div>{video.likesCount}&nbsp;&nbsp;<ThumbUpIcon/></div>  <div>{video.dislikesCount}&nbsp;&nbsp;<ThumbDownIcon/></div><div>{video.visibility==="public"&&<PublicIcon/>}
                {video.visibility==="sub-only"&&<GroupIcon/>}
                {video.visibility==="custom"&&<SettingsIcon/>}</div></div>
              </div> 
            </div>
          </div>
      )
    
  }
    return (
        <div className='videocard2' key={_id}>
          {show?<video className='videocard_video' src={url} muted={true} autoPlay onMouseOut={()=>{setShow(false)}}></video>:<img className="videocard_video" alt="" src={url.replace(path.extname(url),".jpg")} onMouseOver={()=>{window.timeout = setTimeout(()=>setShow(true),700)}} onMouseOut={()=>{if(window.timeout){clearTimeout(window.timeout)}}}/>}
          <div className="videocard2_info">
            
            <div className="videocard_text" >
              <div className="videocard_title" title={title}>{title.length>25?title.substring(0,25) + "...":title}</div>
              <span className="videocard_des" title={description}>{description.length>35?description.substring(0,35) + "...":description}</span>
              <p className="videocard_channel">Uploaded by {channel}</p>
              <p className="videocard_view">{views} views • {timeSince(timestamp)} ago</p>
              <div className="likeinfo"><div>{likesCount}&nbsp;&nbsp;<ThumbUpIcon/></div>  <div>{dislikesCount}&nbsp;&nbsp;<ThumbDownIcon/></div><div onClick={(e)=>{e.preventDefault();ClickListenEvent&&ClickListenEvent(_id)}}>{visibility==="public"&&<PublicIcon/>}
              {visibility==="sub-only"&&<GroupIcon/>}
              {visibility==="custom"&&<SettingsIcon/>}</div></div>
            </div> 
          </div>
        </div>
    )
}

export default VideoCard2;
