import React from "react";

const ChannelTabAbout = ({about}) => { 

  return <>
  <h3 style={{fontWeight:"bold",paddingBottom:"20px",textShadow:"2px 2px 10px #888"}}>About this channel</h3>
  <p>{about.bio ? about.bio : "No specific description available for this channel"}</p>
  <a href={about.website} rel="noreferrer" target="_blank" style={{color:"#00f"}}>{about.website}</a>
  </>;

};

export default ChannelTabAbout;