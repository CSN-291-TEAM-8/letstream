import React from 'react';
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Connect from '../../utils';

const Video = ({url,videoId}) => {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const vjsPlayer = videojs(videoRef.current);       
    vjsPlayer.src({ type: "video/mp4", src: url });   

    vjsPlayer.on("ended", () => {
      Connect("/video/addoneView/"+videoId)
    });
    vjsPlayer.on("play",()=>{
      Connect("/user/addtohistory/"+videoId)
    })

    return () => {
      if (vjsPlayer) {
        vjsPlayer.dispose();
      }
    };
  }, [url,videoId]);

  return (
    <div data-vjs-player style={{maxHeight:"500px",maxWidth:"700px",margin:"auto"}}>
      <video        
        controls
        ref={videoRef}
        className="video-js vjs-big-play-centered"
      ></video>
    </div>
  );
    
}

export default Video;
