import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import { toast } from "react-toastify";
import styled,{keyframes} from "styled-components";
import { SearchDiv } from "../components/Upload/Upload";
import { CircularProgress } from "@material-ui/core";
import Connect from "../utils";


const pulse = keyframes`
    0%{
        box-shadow: 0 0 0 0 rgba(120,120,120,0.4);
    }
    70%{
        box-shadow: 0 0 0 15px rgba(120,120,120,0);
    }
    100%{
        box-shadow: 0 0 0 0 rgba(120,120,120,0);
    }
`;
const opacity = keyframes`
    0%{
        opacity:0;
        transform:translate(30%);
    }
    100%{
        opacity:1;
        transform:translate(0%);
    }
`;
const Broadcastwrapper = styled.div`    
    
    width:450px;
    margin:auto;
    padding:10px;
    text-align:justify;
    margin-top:100px;
    .butn{
        background:linear-gradient( 100deg, #376df9 0, #ff5fa0 75%, #ffc55a 100% );
        width:100%;
        text-align:center;
        animation:${pulse} 2s infinite;
        padding:5px;
        cursor:pointer;
        padding-left:8px;
        display:flex;
        align-items:center;
        justify-content:center;
        margin-top:30px;
    }
    form{
        border:1px solid ${props=>props.theme.borderColor};
    }
    input{
        border-bottom:1px solid ${props=>props.theme.borderColor};
        width:100%;
        margin:10px 0px;
    }
    .danger,select{
        margin:0px 20px
    }
    select{
        margin:10px 20px;
        width:calc(100% - 40px);
    }
    .danger{
        padding-top:20px;
    }
    input[name="searchuser"]{
        margin:10px;
        width:calc(100% - 20px);
    }
    .usersearchresult{
        top:-11px;
    }
    
    h1,h2{
        font-weight:bold;
        text-align:center;
        padding-top:20px;
    }
    
    h1,div,h2{        
        margin-bottom:15px;
        transion:opacity 1s cubic-bezier(0.39, 0.575, 0.565, 1), transform 1s cubic-bezier(0.39, 0.575, 0.565, 1);
        animation: ${opacity} 1s ease-out 0s 1 normal none running;
    }
    div{
        margin-bottom:0;
    }
    
`;

const Broadcast = ()=>{
    const [Stream,setStream] = useState({
        title:"",
        description:"",
        visibility:"public",
        accessibility:[]
    });
    const [users,setUsers] = useState([]);
    const InputEv = (e)=>{
        const {name,value} = e.target;
       // console.log(e.target);
        setStream((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        })
    }
    const history = useHistory();
    

    const AddtoList = (id)=>{
        console.log("Added ",id);
        setStream((prev)=>{
            return {
                ...prev,
                ["accessibility"]:[...prev.accessibility,id]
            }
        })
    }

    const createStream = ()=>{
        if(joinload){
            return;
        }
        if(!Stream.title.trim()||!Stream.description.trim()||!Stream.visibility){
            return toast.error("Please fill in all fields");
        }
        setJoinLoad(true);
        Connect("/user/createlivestream",{body:Stream}).then(d=>{
            window.open(d.url);
            setJoinLoad(false);
        }).catch(err=>{
            setJoinLoad(false);
            toast.error("An error occurred")
        })
    }

    const makerequest = (e)=>{
        InputEv(e);
        if(!e.target.value){
            return;
        } 
        Connect("/user/search",{body:{term:e.target.value}}).then((d)=>{
            setUsers(d.users);
        }).catch(err=>{
            toast.error(err.message);
        })
    }
    const [joinload,setJoinLoad] = useState(false);
    const [currentstate,setState] = useState("intro");

    

    return (
        <Broadcastwrapper>
        {currentstate==="intro"&&<div className="broadcast-intro">
            <h1>Welcome !!</h1>
            <div className="intro">
                This is a page where you can start a live-broadcast from your laptop.Others will be in view and listen mode only.So others can only view and listen to you,but will not be able to share their own audio or video.There is a group chat for all the participants to 
                corporate interactions between participants and organiser.<br/><br/>
                As a broadcaster,you can broadcast using your camera and microphone and can also share your laptop screen.
            </div>
            <div className="butn" onClick={()=>setState("formfill")}>Ready to broadcast?</div>            
        </div>
    }
       {currentstate==="formfill"&&<div className="broadcast-form">
            <form>
                <h2>Just one more step</h2>
                <input type="text" name="title" placeholder="Enter a suitable title" value={Stream.title} onChange={InputEv} required/>
                <input type="text" name="description" placeholder="Enter a suitable description" value={Stream.description} onChange={InputEv} required/>
                <div className="danger">{Stream.visibility==="custom"?"*Only selected people will be able to view your broadcast":Stream.visibility==="sub-only"?"*Only your subscribers can view your broadcast":"*Every logged user can view your broadcast"}</div>
                <select value={Stream.visibility} onChange={InputEv} name="visibility">
                    <option value="public">Public</option>
                    <option value="sub-only">Only subscribers</option>
                    <option value="custom">Custom</option>
                </select>
                {Stream.visibility==="custom"&&
                        <>
                        <div style={{margin:"25px"}}>Search user who should see this live:</div>
                        <input
                         type="text"
                         name="searchuser"
                         onBlur={()=>setTimeout(()=>setUsers([]),200)}
                         onChange={makerequest}
                         placeholder="Search  🔍️"
                         />
                         {Stream.visibility==="custom"&&
                         <div className="usersearchresult">
                         {users&&users.length>0&&users.map(u=><SearchDiv key={u._id} user={u} AddtoList={AddtoList}/>)}
                         </div>
                        }
                        
                         </>
                         
                        }
                        <div className="butn" style={{margin:"auto",marginTop:"50px",padding:"10px"}} onClick={createStream}>{joinload?<CircularProgress size={24}/>:"Broadcast now"}</div>
            </form>
        </div>}
        </Broadcastwrapper>
    )

}

export default Broadcast;