import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Connect } from "../utils";
import SideBarMain from "../components/Sidebar/Main/SideBarMain/SideBarMain";
import MailIcon from '@material-ui/icons/Mail';
import UnsubscribeIcon from '@material-ui/icons/Unsubscribe';
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import { Loader } from "../components/RecommendedVideos/Home";
import NoResults from "../components/Noresults";
import { toast } from "react-toastify";
import { SubscriberContext } from "../utils/SubscriberContext";

const Wrapper = styled.div`
margin-top:-100px;
width:calc(100% - 300px);
margin-left:300px;
float:right;
  .Suggestions{
      margin-top:180px;
      padding-bottom:50px;
      padding-left:50px;
      width:100%;
      float:right;
      
  }
  .usercard{
      width:100%;
      display:flex;
      
      padding:10px;
      flex-wrap:nowrap;
      justify-content:space-between;
  }
  .subscribe_btn{
    padding:5px;
    color:white;
    background:#cc0000;
    text-transform:uppercase;
    z-index:2;
  }
  .unsubscribe_btn{
      background:#ececec;
      color:#616161;
      
      text-transform:uppercase;
      z-index:2;
  }
  
  h3{
    font-size:18px;
    font-weight:bold;
    padding-bottom:20px;
}
.infodiv{
    display:flex;
    cursor:pointer;
    align-items:center;
}
.btn{
    width:170px;
    cursor:pointer;
    padding:5px;
    box-shadow:2px 2px 12px #a8a8a8;
    border-radius:44px;
    padding-left:10px;
    font-size:14px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    height:40px;
    align-self:center;

}
.username{
    font-weight:bold;
}
.fullname{
    color:#616161;
}
  .usercard_info{
      margin-left:50px;
  }

`;
export const subscribe = (user, setSubscription) => {
    Connect("/user/subscribe/" + user._id, { method: "POST" }).then((t) => {
        setSubscription({ currentsubscriptions: t.subscribedto,err:false });
        return;
    }).catch(err => {
        console.log(err);
        setSubscription({ currentsubscriptions: null,err:true });
        toast.error("Action failed");
        return;
    })
}
export const UserCard = ({ user, history, handleusersubscribe, setSubscription }) => {
    const handlesubscribe = (user, isSubscribed) => {
        subscribe(user, setSubscription);
        handleusersubscribe(!isSubscribed, user);
    }
    return <div className="usercard" key={user._id}>
        <div className="infodiv" onClick={() => history.push(`/user/${user._id}`)}>
            <div className="avatar_usercard">
                <Avatar src={user.avatar} />
            </div>
            <div className="usercard_info">
                <div className="username">{user.username}</div>
                <div className="fullname">{user.fullname}</div>
            </div>
        </div>
        {user.isSubscribed ? <div className="unsubscribe_btn btn" onClick={() => handlesubscribe(user, true)}>
            Unsubscribe <UnsubscribeIcon />
        </div> : <div className="subscribe_btn btn" onClick={() => handlesubscribe(user, false)}>
            Subscribe <MailIcon />
        </div>}
        {/* {user.isSubscribed?"Unsubscribe" <UnsubscribeIcon/>:"Subscribe" <MailIcon/>} */}
    </div>
}
// const Users = [
//     {
//         _id: 1,
//         username: "kk2000",
//         fullname: "hello here",
//         avatar: "https://kkleap.github.io/assets/default.jpg",
//         isSubscribed: false,
//     },
//     {
//         _id: 2,
//         username: "kk222000",
//         fullname: "hello here",
//         avatar: "https://kkleap.github.io/assets/default_f.png",
//         isSubscribed: true,
//     },
//     {
//         _id: 3,
//         username: "kk22w000",
//         fullname: "hello here",
//         avatar: "https://kkleap.github.io/assets/default_f.png",
//         isSubscribed: false,
//     },
//     {
//         _id: 4,
//         username: "kk2s000",
//         fullname: "hello dhere",
//         avatar: "https://kkleap.github.io/assets/default.jpg",
//         isSubscribed: true,
//     }
// ];
const Suggestions = () => {
    const [isLoading, setisLoading] = useState(true);
    const { setsubscriber } = React.useContext(SubscriberContext);
    const [error, setErr] = useState({ text: null, title: null });
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const handleusersubscribe = (isSubscribed, user) => {
        const other = [];
        users.forEach(function (d) {
            if (d._id === user._id) {
                d.isSubscribed = isSubscribed;
            }
            other.push(d);
        });
        setUsers(other);
    }
    const setSubscription = ({ currentsubscriptions,err }) => {
        if(!err){
            localStorage.setItem("subscription",JSON.stringify(currentsubscriptions));
            setsubscriber(currentsubscriptions);
        }
    }
    React.useEffect(() => {
        Connect("/user/suggestions", { method: "POST" }).then(data => {
            setUsers(data.users);
            if (data.users.length === 0) {
                setErr({ title: "No Suggestions", text: "There is nothing to show here" });
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
                <SideBarMain selectedTitle="Suggestions" style={{ marginTop: "100px" }} />
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
            <SideBarMain selectedTitle="Suggestions" style={{ marginTop: "100px" }} />
            <Wrapper>
                {!isLoading ? <div className="Suggestions">
                    <h3>Suggested subscriptions</h3>
                    {users.map((item) =>
                        <UserCard
                            key={item._id}
                            handleusersubscribe={handleusersubscribe}
                            setSubscription={setSubscription}
                            history={history}
                            likesCount={item.likesCount}
                            dislikesCount={item.dislikesCount}
                            isLiked={item.isLiked}
                            isdisLiked={item.isdisLiked}
                            user={item}
                        />
                    )}
                </div> : <Loader />}
            </Wrapper>
        </>
    )
}

export default Suggestions;