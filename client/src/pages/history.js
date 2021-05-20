import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoCard2 from "../components/VideoCard/VideoCard2";
import SideBarMain from "../components/Sidebar/Main/SideBarMain/SideBarMain";
//import { Videos } from '../assets/getVideo';
import styled from "styled-components";
import { Loader } from "../components/RecommendedVideos/Home";
import NoResults from "../components/Noresults";
import { Connect } from "../utils";
import { toast } from "react-toastify";

const Wrapper = styled.div`
margin-top:-100px;
width:calc(100% - 300px);
margin-left:300px;
float:right;
  .history{
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

const History = () => {
    const [isLoading, setisLoading] = useState(true);
    const [error, setErr] = useState({ text: null, title: null });
    const [Videos, setVideos] = useState([]);
    useEffect(() => {
        Connect("/user/history", { method: "POST" }).then(data => {
            setVideos(data.videos);
            if (data.videos.length === 0) {
                setErr({ title: "No videos found", text: "There is nothing to show here" });
            }
            setisLoading(false);
        }).catch(err => {
            setErr({ text: err.message, title: "Error in loading page" });
            setisLoading(false);
        })
    }, []);
    

    const RemovefromHistory = (vid)=>{
        if(!vid){
            return;
        }
        const t = window.confirm("Do u want to remove this video from your history?");
        if(t){
            Connect("/user/removefromhistory/"+vid,{method:"DELETE"}).then(d=>{
                setVideos(Videos.filter(function(v){return v._id !== vid}))                
            }).catch(err=>{
                toast.error("Error in removing from history");
            })
        }
    }
    if (error.text) {
        return (
            <>
                <SideBarMain selectedTitle="History" style={{ marginTop: "100px" }} />
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
            <SideBarMain selectedTitle="History" style={{ marginTop: "100px" }} />
            <Wrapper>
                {!isLoading ? <div className="history">
                    <h3>History</h3>
                    {Videos.map((item) => <Link key={item._id} to={`/video/${item._id}`}>
                        <VideoCard2
                            title={item.title}
                            _id={item._id}
                            likesCount={item.likesCount}
                            dislikesCount={item.dislikesCount}
                            description={item.description}
                            visibility={item.visibility}
                            url={item.url}
                            views={item.views}
                            timestamp={item.createdAt}
                            channel={item.organiser.username}
                            ClickListenEvent={RemovefromHistory}
                        />
                    </Link>)}
                </div> : <Loader />}
            </Wrapper>
        </>
    )
}

export default History;