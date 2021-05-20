import React, { useState } from "react";
import "./VideoCard.css";
import path from "path"

const Videocard3 = ({video,noHoverplay})=>{
    const [show,setShow] = useState(false);
    if(noHoverplay){
        return <div className='videocard'>
            <img className="videocard_video" alt="" src={video.url.replace(path.extname(video.url), ".jpg")} onMouseOver={() => setShow(true)} />
            </div>
    }
    return <div className='videocard'>
    {show ?
      <video className='videocard_video' src={video.url} muted={true} autoPlay onMouseOut={() => { setShow(false) }}></video>
      : <img className="videocard_video" alt="" src={video.url.replace(path.extname(video.url), ".jpg")} onMouseOver={()=>{window.timeout = setTimeout(()=>setShow(true),700)}} onMouseOut={()=>{if(window.timeout){clearTimeout(window.timeout)}}} />}
  </div>
}

export default Videocard3;