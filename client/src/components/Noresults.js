import React from "react";
import styled from "styled-components";
import noresults from "../assets/noresults.png";

export const Center = styled.div`
  position: absolute;
  left:calc(50% + 150px);
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  .danger{
      color:#f00;
  }
  img {
    width: 300px;
    height: 200px;
  }
`;

const NoResults = ({ title, text,center,left}) => {
  if(left){
    return (
      <Center style={{left:`calc(50% - 200px)`}} className="noresult">
        <img src={noresults} alt="no results" />
        <h2>{title}</h2>
        <p className="danger">{text}</p>
      </Center>
    )
  }
  return !center?
   (
    <Center style={{left:center?"calc(50% - 150px) !important":"calc(50% + 150px) !important"}}>
      <img src={noresults} alt="no results" />
      <h2>{title}</h2>
      <p className="danger">{text}</p>
    </Center>
  ):
  (
    <center style={{left:center?"calc(50% - 150px) !important":"calc(50% + 150px) !important"}}>
      <img src={noresults} alt="no results" />
      <h2>{title}</h2>
      <p className="danger">{text}</p>
    </center>
  )
};

export default NoResults;