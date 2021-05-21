import React, { useEffect, useState } from 'react';
import Video from '../Video/Video';
import VideoInfo from '../VideoInfo/VideoInfo';
import './VideoPlayer.css';
//import RecommendedVideos from '../RecommendedVideos/Home';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from 'react-router';
import VideoCard2 from '../VideoCard/VideoCard2';

import Connect from '../../utils';
import Noresults from "../Noresults";
import VideoSkeleton from '../Videoskeleton';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ModalWrapper } from '../profile/EditProfile';
import { SearchDiv } from '../Upload/Upload';

// const videoInfo = {
//     title: "hello",
//     description: "hello",
//     createdAt: 151617171818181881,
//     username: "pen bhakti",
//     avatar: "",
//     viewsCount: 9,
//     likesCount: 12,
//     dislikesCount: 2,
//     subs: 22
// }


const RecommendedVideos = ({ videos, loading }) => {


    if (loading) {
        return [{ _id: 1 }, { _id: 2 }, { _id: 3 }].map(x =>
            <VideoSkeleton key={x._id} />
        )
    }
    if (videos) {
        if (videos.length > 0)
            return videos.map(x =>
                <Link to={`/video/${x._id}`} key={x._id}>
                    <VideoCard2 video={x} />
                </Link>
            )
    }
    return <div></div>;

}

const VideoPlayer = () => {
    //Received as a prop from where req for data is made
    const [isLoading, setIsLoading] = useState(true);
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

    const [currentvideo, setCurrVideo] = useState({});
    const [recommendedload, setLoad] = useState(true);
    const [err, setVideoFetchErr] = useState({ title: "", text: "" })
    const [Videos, setVideos] = useState([]);
    const { videoId } = useParams();
    const [optionModal,setMoreOptionModal] = useState(false);
    const [reportModal,setReportModal] = useState(false);
    //console.log(VideoInfo);
    useEffect(() => {

        Connect("/video/getinfo/" + videoId).then(data => {
            setCurrVideo(data.video);
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
            setVideoFetchErr({ title: "Requested video could not be fetched", text: err.message });
        })
        Connect("/user/feed", { body: { limit: 5 } }).then(data => {
            setVideos(data.videos);
            setLoad(false);
        }).catch(err => {
            setLoad(false);

            console.log(err.message, "Failed to fetch recommended videos");
        })
    }, []);

    const Activities = ({ type, vid }) => {
        let video;
        switch (type) {
            case "likevideo":
                Connect(`/video/${vid}/togglelike`).then(data => {
                    video = currentvideo;
                    video.isLiked = data.isLiked;
                    if (data.isLiked) {
                        if (video.isdisLiked)
                            video.dislikesCount = video.dislikesCount - 1;
                        video.likesCount = video.likesCount + 1;
                    }
                    else {
                        video.likesCount = video.likesCount - 1;
                    }
                    video.isdisLiked = data.isdisLiked;
                    setCurrVideo(video);
                    forceUpdate();
                }).catch(err => toast.error("An error occurred"));
                break;
            case "dislikevideo":
                Connect(`/video/${vid}/toggledislike`).then(data => {
                    if (data.isdisLiked) {
                        if (currentvideo.isLiked)
                            currentvideo.likesCount = currentvideo.likesCount - 1;
                        currentvideo.dislikesCount = currentvideo.dislikesCount + 1;
                    }
                    else {
                        currentvideo.dislikesCount = currentvideo.dislikesCount - 1;
                    }
                    currentvideo.isLiked = data.isLiked;
                    currentvideo.isdisLiked = data.isdisLiked;
                    video = currentvideo;
                    setCurrVideo(video);
                    forceUpdate();
                }).catch(err => toast.error(err.message));
                break;
            case "savevideo":
                Connect(`/user/savevideo/${vid}`).then(data => {
                    video = currentvideo;
                    video.isSaved = data.isSaved;
                    setCurrVideo(video);
                    forceUpdate();
                }).catch(err => toast.error("An error occurred"));
                break;
            case "sharevideo":
                const el = document.createElement("textarea");
                el.value = window.location.href;
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                el.remove();
                toast.success("Link was copied to clipboard");
                navigator.share&&navigator.share({url:window.location.href,title:"Watch this video on letstream",text:`Watch this video uploaded by ${currentvideo.organiser.username} on letstream`}).then(()=>{}).catch(err=>{});
                break;
            case "moreoption":
                setMoreOptionModal(true);
                break;
            case "editvideo":
                break;
            default:
                break;
        }
    }
    const DeleteVideo = ()=>{
        Connect("/video/"+currentvideo._id,{method:"DELETE"}).then((d)=>{
            window.location.replace("/");
        }).catch(err=>toast.error(err.message));
    }
    const [reporttext,setReport] = useState("");
    const [selected,setSelected] = useState("Spam or misleading");
    const [subload,setsubload] = useState(false);
    const [editModal,setEditModal] = useState(false);
    const submitReport=()=>{
        if(subload){
            return;
        }
        
        if(reporttext.length>300){
            toast.error("Max limit is 300 letters");
        }
        setsubload(true);
        Connect("/video/report/"+currentvideo._id,{body:{report:reporttext+" category="+selected}}).then(d=>{
            setReportModal(false);
            setsubload(false);
            toast.success("Report submitted successfully")
        }).catch(err=>{
            setsubload(false);
            toast.error(err.message);
        })
    }
    const [data, setData] = useState({
        title: "",
        visibility:"public",
        description: "",
        keywords: "",
        accessibility:[],
        searchuser:"",        
    });
    const [users,setUsers] = useState([]);
    const [accessibility,setAccessibility] = useState([]);
    const [privacychange,setPrivacychange] = useState(false);
    const [editload,setEditLoad] = useState(false);

    const InputEv = (e) => {
        const { name, value } = e.target;
        
        if(name==="visibility"){
            if(!privacychange){
                setPrivacychange(true);
                setAccessibility([]);
            }
        }
        setData((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }
    

    
    const AddtoList = (id)=>{
        if(!privacychange){
            setPrivacychange(true);
            setAccessibility([]);
        }
        console.log("Added ",id);
        setAccessibility([...accessibility,id]);

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

    const setUPEditingModal = ()=>{
        setTimeout(function(){            
        setData({
            title:currentvideo.title.split('|')[0],
            description:currentvideo.description,
            keywords:currentvideo.keywords,
            visibility:currentvideo.visibility,
            accessibility:currentvideo.accessibility,
            searchuser:""
        });
    },1000);
        setData({});
        setEditModal(true);
        setMoreOptionModal(false);
    }

    const submitEdittedData = ()=>{
        if(editload){
            return;
        }
        setEditLoad(true);   
        const body = data;

        body.accessibility = accessibility;     
        setTimeout(()=>{Connect("/video/editVideo/"+currentvideo._id,{body:body}).then(d=>{            
            setEditLoad(false);
            toast.success("Updated successfully");
            setTimeout(()=>window.location.reload(),1000);
        }).catch(err=>{setEditLoad(false);toast.error(err.message)})},1000);
    }


    return (

        <div className='videoplayer'>
            {optionModal&&
              <ModalWrapper>
                  <div className="modal-content">
                    <div className="choice danger" onClick={()=>setMoreOptionModal(false)}>Cancel</div>
                    {currentvideo.isMyVideo&&<div className="choice" onClick={setUPEditingModal}>Edit details</div>}
                   {!currentvideo.isMyVideo&&!currentvideo.isAdmin?<div className="choice danger" onClick={()=>{setMoreOptionModal(false);setReportModal(true)}}>Report video</div>:
                    <div className="choice danger" onClick={DeleteVideo}>Delete video</div>}
                    
            </div>
              </ModalWrapper>
            }{
                editModal&&!optionModal&&<ModalWrapper>
                    <div className="modal-content2">
                        <textarea value={data.title} onChange={InputEv} name="title" placeholder="Title"></textarea>
                        <textarea value={data.description} onChange={InputEv} name="description" placeholder="Description"></textarea>
                        <textarea value={data.keywords} onChange={InputEv} name="keywords" placeholder="Keywords"></textarea>
                        <span style={{marginTop:"20px",paddingLeft:"20px",color:"grey"}}>Choose who should see this:</span>
                        <span style={{color:"red",fontSize:"14px",padding:"20px"}}>WARNING:If you change this field,your video privacy will be reset</span>
                        <select value={data.visibility} className="sel" onChange={InputEv} name="visibility">
                            <option value="public">public</option>
                            <option value="sub-only">Only subscribers</option>
                            <option value="custom">Custom</option>
                        </select>
                        {data.visibility==="custom"&&<input type="text" name="searchuser" onChange={makerequest} value={data.searchuser}
                         onBlur={()=>setTimeout(()=>setUsers([]),200)}
                         placeholder="Search  🔍️"/>}
                        {data.visibility==="custom"&&
                         <div className="usersearchresult">
                         {users&&users.length>0&&users.map(u=><SearchDiv key={u._id} user={u} AddtoList={AddtoList}/>)}
                         </div>
                        }
                        <div className="choice-btn"><div className="modalbtn btndanger" onClick={()=>setEditModal(false)}>Cancel</div><div className="modalbtn btnsuccess" onClick={submitEdittedData}>{editload?<CircularProgress size={20}/>:"Submit"}</div></div>
                    </div>
                </ModalWrapper>
            }
            {
                reportModal&&!optionModal&&<ModalWrapper>
                    <div className="modal-content">
                    <textarea 
                    placeholder="Describe why are u reporting it?"
                    value={reporttext}
                    required={true}
                    onChange={(e)=>setReport(e.target.value)}>

                    </textarea>
                    <div className="text"> Select appropriate category:</div>
                    <select value={selected} onChange={(e)=>setSelected(e.target.value)}>
                        <option value="Sexual content">Sexual content</option>
                        <option value="Violent or repulsive content">Violent or repulsive content</option>
                        <option value="Hateful or abusive content">Hateful or abusive content</option>
                        <option value="Harmful or dangerous acts">Harmful or dangerous acts</option>
                        <option value="Spam or misleading">Spam or misleading</option>
                    </select>
                    <div className="choice-btn">
                        <div className="modalbtn btndanger" onClick={()=>setReportModal(false)}>Cancel</div>
                        <div className="modalbtn btnsuccess" onClick={submitReport}>{subload?<CircularProgress size={19}/>:"Submit"}</div>
                    </div>
                    </div>
                </ModalWrapper>
            }
            <div className='videoplayer_videodetails'>
                {!err.title ? (
                    <>
                        <div className='videoplayer_video'>
                            {isLoading ? <CircularProgress className='videoloading' color='secondary' /> : <Video url={currentvideo.url} videoId={currentvideo._id}/>}
                        </div>
                        <div className='videoplayer_videoinfo'>
                            {!isLoading && !err.title && <VideoInfo
                                video={currentvideo}
                                videoId={videoId}
                                Activities={Activities}
                            />
                            }
                        </div>
                    </>
                ) : <Noresults title={err.title} text={err.text} left={true} />}
            </div>
            {(recommendedload || Videos.length === 0) ? <div className='videoplayer_suggested' style={{ marginRight: "-200px" }}>
                {!recommendedload && Videos.length > 0 && (<h3 className="videoplayer_h3">Suggested videos</h3>)}
                <RecommendedVideos videos={Videos} loading={recommendedload} />
            </div> : <div className='videoplayer_suggested'>
                {!recommendedload && Videos.length > 0 && (<h3 className="videoplayer_h3">Suggested videos</h3>)}
                <RecommendedVideos videos={Videos} loading={recommendedload} />
            </div>}
        </div>
    )
}

export default VideoPlayer;