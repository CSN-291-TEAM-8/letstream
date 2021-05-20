import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useState } from 'react';
import path from "path";

import { Connect, uploadMediaFile } from '../../utils';
import {
    Form,
    Container,
    FormContent,
    FormInput,
    FormButton,
    FormH1,
    FormWrap,
    FormSearchInput,
    TextArea,
    FormLabel,
    InputLabel
} from './UploadElements'
import { toast } from 'react-toastify';
import { Avatar, CircularProgress } from '@material-ui/core';

export const SearchDiv =({user,AddtoList})=>{
    return <div style={{width:"100%",display:"flex",flexWrap:"nowrap",padding:"10px",borderBottom:"1px solid #535353"}} onClick={()=>{toast.success(user.fullname+" will be able to view it");AddtoList(user._id)}}>
                <div style={{display:"flex",paddingRight:"20px"}}>
                    <Avatar src={user.avatar} style={{alignSelf:"center"}}/>
                </div>
                <div style={{display:"flex",alignItems:"center",flexWrap:"wrap"}}>
                    <div style={{width:"100%"}}>{user.username}</div>
                    <div style={{width:"100%"}} className="secondary">{user.fullname}</div>
                </div>
            </div>
}

const VideoForm = () => {
    const [loading,setLoading] = useState(false);
    const [users,setUsers] = useState([]);
    const [accessibility,setAccessibility] = useState([]);
    const [previewurl, setPreviewVideo] = useState("");
    const [data, setData] = useState({
        title: "",
        visibility:"public",
        description: "",
        keywords: "",
        accessibility:[],
        searchuser:"",
        url: "",
        thumbnail: ""
    });
    const AddtoList = (id)=>{
        console.log("Added ",id);
        setAccessibility([...accessibility,id]);

    }
    const makerequest = (e)=>{
        InputEvent(e);
        if(!e.target.value){
            return;
        } 
        Connect("/user/search",{body:{term:e.target.value}}).then((d)=>{
            setUsers(d.users);
        }).catch(err=>{
            toast.error(err.message);
        })
    }

    const inputEvent = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const type = file.type.includes("video");
            if (!type) {
                return toast.info("Kindly upload a video");
            }
            const size = file.size / 1000000;

            if (size > 30) {
                return toast.error("Sorry, file size should be less than 30MB");
            }

            const url = URL.createObjectURL(file);
            setPreviewVideo(url);
            try {
                const data2 = await uploadMediaFile("video", file);
                console.log(data2);
                InputEvent({target:{name:"url",value:data2}});
                const ext = path.extname(data2);
                InputEvent({target:{name:"thumbnail",value:data2.replace(ext, ".jpg")}}); 
            }
            catch (err) {
                toast.error("Error in uploading video");
            }

        }
    }

    const InputEvent = (e) => {
        const { name, value } = e.target;
        

        setData((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }



    const handleSubmit = (e) => {
        e.preventDefault();
        if(loading) return;
        
        //console.log(data); 
        if(data.visibility==="custom"&&accessibility?.length===0){
            return toast.error("kindly add atleast one user who should watch this video")
        }
        if (data.title.trim() && data.description.trim() && data.keywords&& data.thumbnail && data.url) {
            setLoading(true);
            window.data = data;
            window.data.keywords = data.keywords.split(",");
            window.data.accessibility = accessibility;
            
              //data.keywords = data.keywords.split(",");
            Connect("/user/uploadvideo", { body: window.data }).then(() => {
                toast.success("Uploaded successfully");
                setTimeout(() => {
                    window.location.replace("/user/myvideos");
                }, 1000);
            }).catch(err=>{
                setLoading(false);
                toast.error("unexpected Error in uploading")
            })
        }
        else {
            console.log(data);
            return toast.error("Kindly fill in all fields");
        }

    };


    return (
        <Container>
            <FormWrap>
                <FormContent>
                    <Form onSubmit={handleSubmit}>
                        <FormH1>Upload Video</FormH1>
                        <FormInput
                            type='text'
                            placeholder='Enter title'
                            onChange={InputEvent}
                            value={data.title}
                            name='title'
                            required
                        />
                        <FormInput
                            type='text'
                            placeholder='Add keywords with comma(,)'
                            onChange={InputEvent}
                            value={data.keywords}
                            name='keywords'
                            required
                        />

                        <TextArea
                            type='text'
                            placeholder='Enter description'
                            onChange={InputEvent}
                            value={data.description}
                            name="description"
                            required
                        />
                        <FormLabel>Choose who should see this:</FormLabel>
                        <select
                            value={data.visibility}
                            title={data.visibility==="sub-only"?"Only your subscribers can watch it":
                        (data.visibility==="custom"?"Selected people that you choose can watch it":"Every logged user can watch it")}
                            className="select"                            
                            name="visibility"
                            onChange={InputEvent}                            
                            placeholder="Choose Visibility"                            
                        >
                            <option value="public">public</option>
                            <option value="sub-only">Only subscribers</option>
                            <option value="custom">Custom</option>
                        </select>
                        {data.visibility==="custom"&&
                        <>
                        <FormLabel style={{marginTop:"15px"}}>Search user who should see this video:</FormLabel>
                        <FormSearchInput
                         type="text"
                         name="searchuser"
                         onBlur={()=>setTimeout(()=>setUsers([]),200)}
                         onChange={makerequest}
                         placeholder="Search  🔍️"
                         />
                         {data.visibility==="custom"&&
                         <div className="usersearchresult">
                         {users&&users.length>0&&users.map(u=><SearchDiv key={u._id} user={u} AddtoList={AddtoList}/>)}
                         </div>
                        }
                         </>
                         
                        }
                        <FormLabel>Upload a File:</FormLabel>
                        <InputLabel>
                            <input
                                style={{ display: "none" }}
                                type="file"
                                name="videofile"
                                accept="video/*"
                                onChange={inputEvent} />
                            <CloudUploadIcon style={{ marginRight: "10px" }} />
                        Choose video
                        </InputLabel>
                        {
                            previewurl &&
                            <video src={previewurl} autoPlay loop muted></video>
                        }
                        {data.url&&<FormButton type="submit">
                            {loading?<CircularProgress size={20}/>:"Upload"}
                        </FormButton>}
                    </Form>
                </FormContent>
            </FormWrap>
        </Container>

    );

}

export default VideoForm;