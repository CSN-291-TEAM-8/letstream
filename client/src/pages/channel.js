import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useParams } from "react-router-dom";
import NoResults from "../components/Noresults";
import { Loader } from "../components/RecommendedVideos/Home";
import Connect from "../utils";
import ChannelTabAbout from "./ChannelTabAbout";
import ChannelTabChannels from "./ChannelTabChannels";
import ChannelTabVideo from "./ChannelTabVideo";
import { subscribe } from "./suggestions";

import cover from "../assets/cover.png";
import { Avatar, CircularProgress } from "@material-ui/core";
import EditProfile from "../components/profile/EditProfile";
import SideBarMain from "../components/Sidebar/Main/SideBarMain/SideBarMain";
import { SubscriberContext } from "../utils/SubscriberContext";
const activeTabStyle = {
  borderBottom: "2px solid gray",
  fontWeight: "bold",

};

const Wrapper = styled.div`
    margin-top:-100px;
    width:100%;
    float:right;
    padding-bottom: 7rem;
    .channelPage{
      padding-bottom:50px;
      margin-top:160px;      
      width:calc(100% - 300px);
      float:right;      
  }
  
  
    .flex-row {
      display: flex;
      align-items: center;
    }
    
    .cover {
      height: 170px;
    }
    .cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .header-tabs {
      padding: 1.2rem 1rem;
      background:${(props) => props.theme.lightDark}
      
    }
    .header2 {
      width: 80%;
      display: flex;
      margin: 0 auto;
      justify-content: space-between;
      align-items: center;
    }
    .tabs,
    .tab {
      margin: 0 auto;
      margin-top: 1.5rem;
      width: 80%;
    }
    ul {
      list-style: none;
      display: flex;
      align-items: center;
    }
    li {
      margin-right: 2rem;
      text-transform: uppercase;
      letter-spacing: 1.1px;
    }
    li:hover {
      cursor: pointer;
    }
    @media screen and (max-width: 860px) {
      .header2,
      .tabs,
      .tab {
        width: 90%;
      }
    }
    @media screen and (max-width: 470px) {
      .header2,
      .tabs {
        width: 100%;
      }
    }
    ${(props) =>
    props.editProfile &&
    css`
        @media screen and (max-width: 440px) {
          .header2 {
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
          }
        }
      `}
  `;

const Channel = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [load, setsubloading] = useState(false);
  const { setsubscriber } = React.useContext(SubscriberContext);
  //const id = JSON.parse(localStorage.getItem("user"))._id;
  const [err, setErr] = useState({ header: null, text: null });
  const [profile, setProfile] = useState(null);
  const [isSubscribed, setSubscribed] = useState(null);
  const [tab, setTab] = useState("VIDEOS");



  const setSubscription = ({ currentsubscriptions, err }) => {
    if(load){
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
    Connect("/user/getuserbyid", { body: { id: userId } }).then((data) => {
      if (!data.user.isMe) {
        setSubscribed(data.user.isSubscribed);
      }
      setLoading(false);
      setProfile(data.user);

    }).catch(err => {
      setLoading(false);
      setErr({ header: "Error in fetching profile", text: err.message });
    })


  }, []);

  if (!loading && !profile) {
    return (
      <>
        <SideBarMain style={{ marginTop: "100px" }} />
        <Wrapper>
          <NoResults
            title={err.header}
            text={err.text}
          />
        </Wrapper>
      </>
    );
  }

  if (loading) {
    return <>
      <SideBarMain style={{ marginTop: "100px" }} />
      <Wrapper>
        <Loader />
      </Wrapper>
    </>;
  }

  return (
    <>
      <SideBarMain style={{ marginTop: "100px" }} />
      <Wrapper editProfile={profile.isMe}>
        <div className="channelPage">
          <div className="cover">
            <img src={profile.cover || cover} alt="channel-cover" />
          </div>

          <div className="header-tabs">
            <div className="header2">
              <div className="flex-row">
                <Avatar
                  src={profile.avatar}
                  alt="channel avatar"
                />
                <div style={{ paddingLeft: "20px" }}>
                  <h3>{profile.username}</h3>
                  <span className="secondary">
                    {profile.subscribersCount} subscribers
                </span>
                </div>
              </div>

              

              {!profile.isMe && isSubscribed && (
                <div className="btn unsubscribe-btn" onClick={() => handleSubscribe(profile)}>
                  {load ? <CircularProgress size={26} color="inherit"/> : "Subscribed"}
                </div>
              )}

              {!profile.isMe && !isSubscribed && (
                <div className="btn subscribe-btn" onClick={() => handleSubscribe(profile)}>
                  {load ? <CircularProgress size={26} color="inherit"/> : "Subscribe"}
                </div>
              )}
              {(profile.isMe||profile.isAdmin) && <EditProfile isAdmin={profile.isAdmin&&!profile.isMe} isMe={profile.isMe} _id={profile._id}/>}
            </div>

            <div className="tabs">
              <ul>
                <li
                  style={tab === "VIDEOS" ? activeTabStyle : {}}
                  onClick={() => setTab("VIDEOS")}
                >
                  Videos
              </li>
                <li
                  style={tab === "CHANNELS" ? activeTabStyle : {}}
                  onClick={() => setTab("CHANNELS")}
                >
                  Channels
              </li>
                <li
                  style={tab === "ABOUT" ? activeTabStyle : {}}
                  onClick={() => setTab("ABOUT")}
                >
                  About
              </li>
              </ul>
            </div>
          </div>
              <hr style={{color:"#dbd0d0"}}/>
          <div className="tab">
            {tab === "VIDEOS" && <ChannelTabVideo videos={profile.videos} />}
            {tab === "ABOUT" && <ChannelTabAbout about={{ bio: profile.bio, website: profile.website }} />}
            {tab === "CHANNELS" && <ChannelTabChannels profile={profile} />}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default Channel;