import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display:flex;
  flex-wrap:wrap;
  flex-direction:column;
  a{
      padding-bottom:20px;
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 53px;
    align-self:center;
    margin-right:30px;
    object-fit: cover;
  }
  h3{
      width:100%;
      clear:both;
      
  }
  .channel {
    display: flex;
    flex-wrap:nowrap;
    justify-content: start;
  }
  .channel_div{
      display:flex;
      flex-wrap:wrap;
  }
  @media screen and (max-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 500px) {
    width: 90%;
    margin: 0 auto;
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ChannelTabChannels = ({profile}) => {
  

  if (!profile.subscribers.length) {
    return <p>Not subscribed by any channel yet</p>;
  }

  return (
      <>
      <h3 style={{textShadow:"2px 2px 10px #888"}}>Channels who have subscribed to this channel</h3><br/>
    <Wrapper>
        
      {profile.subscribers.map((channel) => (
        <Link to={`/user/${channel._id}`} key={channel._id}>
          <div className="channel">
            <img src={channel.avatar} alt="avatar" />
            <div className="channel_div">
            <h3>{channel.username}</h3>
            <p className="secondary">{channel.subscribersCount} subscribers</p>
            </div>
            {!channel.isMe&&(channel.isSubscribed?<div className="btn unsubscribe-btn" style={{margin:"auto",marginLeft:"40px"}}>Subscribed</div>:<div className="btn subscribe-btn" style={{margin:"auto",marginLeft:"40px"}}>Subscribe</div>)}
          </div>
        </Link>
      ))}
    </Wrapper>
    </>
  );
};

export default ChannelTabChannels;