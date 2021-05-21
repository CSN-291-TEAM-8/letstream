import React, { useState } from "react";
//import { Link } from "react-router-dom";
import VideoCard2 from "../components/VideoCard/VideoCard2";
import SideBarMain from "../components/Sidebar/Main/SideBarMain/SideBarMain";
//import { Videos } from '../assets/getVideo';
import styled from "styled-components";
import { Loader } from "../components/RecommendedVideos/Home";
import NoResults from "../components/Noresults";
import { Connect } from "../utils";

const Wrapper = styled.div`
margin-top:-100px;
width:calc(100% - 300px);
margin-left:300px;
float:right;
  .live{
    padding-bottom:50px;
      margin-top:180px;
      padding-left:50px;
      width:100%;
      float:right;
      
  }
  h3{
    font-size:18px;
    font-weight:bold;
}
  

`;

const LiveVideos = () => {
    const [isLoading, setisLoading] = useState(true);
    const [error, setErr] = useState({ text: null, title: null });
    const [Videos, setVideos] = useState([]);
    React.useEffect(() => {
        Connect("/user/livevideos", { method: "POST" }).then(data => {
            setVideos(data.lives);
            if (data.lives.length === 0) {
                setErr({ title: "No live event found", text: "There is nothing to show here" });
            }
            setisLoading(false);
        }).catch(err => {
            setErr({ text: err.message, title: "Error in loading page" });
            setisLoading(false);
        })
    }, [])
    if (error.text) {
        return (
            <>
                <SideBarMain selectedTitle="Live videos" style={{ marginTop: "100px" }} />
                <Wrapper>
                    <NoResults
                        title={error.title}
                        text={error.text}
                    />
                </Wrapper>
            </>
        );
    }
    return (
        <>
            <SideBarMain selectedTitle="Live videos" style={{ marginTop: "100px" }} />
            <Wrapper>
                {!isLoading ? <div className="live">
                    <h3>Live videos</h3>
                    {Videos.map((item) => <div onClick={()=>window.open(`/livestreaming/${item.roomid}`)} key={item._id} >
                        <VideoCard2
                            title={item.title}
                            _id={item._id}
                            description={item.description}
                            visibility={item.visibility}                            
                            url={item.url}
                            views={item.participants.length}
                            timestamp={item.createdAt}
                            channel={item.organiser.username}
                            live={true}
                        />
                    </div>)}
                </div> : <Loader />}
            </Wrapper>
        </>
    )
}

export default LiveVideos;