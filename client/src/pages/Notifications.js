import React, { useState } from "react";
import { Link } from "react-router-dom";

import SideBarMain from "../components/Sidebar/Main/SideBarMain/SideBarMain";
//import { notices } from "../assets/getNotificationdata";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import { timeSince } from "../utils";
import { Loader } from "../components/RecommendedVideos/Home";
import NoResults from "../components/Noresults";
import { Connect } from "../utils";

const Wrapper = styled.div`
margin-top:-100px;
width:calc(100% - 300px);
margin-left:300px;
float:right;
  .notifications{
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
.noticecomponent{
    width:100%;
    padding:10px;
    padding-top:20px;
    display:flex;
    align-items:center;
}
.avatar_part{
    margin-right:20px;
    display:flex;
    align-items:center;
}
.infomessage{
    flex-wrap:wrap;
    display:flex;
    align-items:center;
    padding-left:20px;
}
.createdAt{
    color:#616161;
    font-size:small;
    padding-top:5px;
}
.msgtext{
    word-break:break-all;
    font-weight:bold;
    width:100%;
}
  

`;

const NoticeComponent = ({ notice }) => {


    return <div className="noticecomponent">
        <div className="avatar_part">
            <Avatar src={notice.avatar} />
        </div>
        <div className="infomessage">
            <div className="msgtext">{notice.Message}</div>
            <div className="createdAt">{timeSince(notice.createdAt)}</div>
        </div>
    </div>
}

const Notifications = () => {
    const [isLoading, setisLoading] = useState(true);
    const [error, setErr] = useState({ text: null, title: null });
    const [notices, setnotices] = useState([]);
    React.useEffect(() => {
        Connect("/user/notifications", { method: "POST" }).then(data => {
            setnotices(data.notices);
            if (data.notices.length === 0) {
                setErr({ title: "No notice found", text: "There is nothing to show here" });
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
                <SideBarMain selectedTitle="Notifications" style={{ marginTop: "100px" }} />
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
            <SideBarMain selectedTitle="Notifications" style={{ marginTop: "100px" }} />
            <Wrapper>
                {!isLoading ? <div className="notifications">
                    <h3>Notifications</h3>
                    {notices.map((item) => <Link key={item._id} to={`${item.url}`}>
                        <NoticeComponent
                            notice={item}
                        />
                    </Link>)}
                </div> : <Loader />}
            </Wrapper>
        </>
    )
}

export default Notifications;