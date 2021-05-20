import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Videocard3 from "../components/VideoCard/Videocard3";



const Wrapper = styled.div`
  .channelvideos {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
  }
  @media screen and (max-width: 830px) {
    .channelvideos {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media screen and (max-width: 540px) {
    .channelvideos {
      grid-template-columns: 1fr;
    }
  }
`;

const ChannelTabVideo = ({ videos }) => {

    
    if (!videos?.length) {
        return <p>This channel hasn't posted any videos yet</p>;
    }

    return (
        <Wrapper>
            <div className="channelvideos">
                {videos?.map((video) => (
                    <Link to={`/video/${video._id}`} key={video._id}>
                        <Videocard3 video={video}/>
                    </Link>
                ))}
            </div>
        </Wrapper>
    );
};

export default ChannelTabVideo;