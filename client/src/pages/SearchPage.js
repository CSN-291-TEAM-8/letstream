import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import VideoCard2 from "../components/VideoCard/VideoCard2";
import SideBarMain from "../components/Sidebar/Main/SideBarMain/SideBarMain";
import { Connect } from "../utils";
import styled from "styled-components";
import { Loader } from "../components/RecommendedVideos/Home";
import NoResults from "../components/Noresults";

const Wrapper = styled.div`
margin-top:-100px;
width:calc(100% - 300px);
margin-left:300px;
float:right;
  .searchvideos{
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

const SearchVideos = () => {
    const { term } = useParams();
    const [isLoading, setisLoading] = useState(true);
    const [error, setErr] = useState({ text: null, title: null });
    const [Videos, setVideos] = useState([]);
    React.useEffect(() => {
        Connect("/video/search", { body: { term } }).then(data => {
            setVideos(data.videos);
            if (data.videos.length === 0) {
                setErr({ title: "No match found", text: "There is nothing to show here which matches your search" });
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
                <SideBarMain selectedTitle="Search videos" style={{ marginTop: "100px" }} />
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
            <SideBarMain selectedTitle="Search videos" style={{ marginTop: "100px" }} />
            <Wrapper>
                {!isLoading ? <div className="searchvideos">
                    <h3>Videos matching your search</h3>
                    {Videos.map((item) => <Link key={item._id} to={`/video/${item._id}`}>
                        <VideoCard2
                            title={item.title}
                            _id={item._id}
                            description={item.description}
                            visibility={item.visibility}
                            url={item.url}
                            likesCount={item.likesCount}
                            dislikesCount={item.dislikesCount}
                            isLiked={item.isLiked}
                            isdisLiked={item.isdisLiked}
                            views={item.views}
                            timestamp={item.createdAt}
                            channel={item.organiser.username}
                        />
                    </Link>)}
                </div> : <Loader />}
            </Wrapper>
        </>
    )
}

export default SearchVideos;