import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import CloseIcon from '@material-ui/icons/Close';
import Connect, { uploadImage } from "../../utils";
import { Avatar, CircularProgress } from "@material-ui/core";
import defaultcover from "../../assets/cover.png";


const openModal = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 900;
  background: rgba(0, 0, 0, 0.7);
  animation: ${openModal} 0.5s ease-in-out;
  .edit-profile {
    width: 580px;
    border-radius: 4px;
    background: ${(props) => props.theme.bg};
    margin: 36px auto;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.4), 0px 0px 4px rgba(0, 0, 0, 0.25);
  }
  .edit-profile img {
    object-fit: cover;
  }
  .avatar {
    margin-top: -40px;
    margin-left: 10px;
    width:50px;
    height:50px;
    object-fit:cover;
  }
  div.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }
  h3 {
    display: flex;
    align-items: center;
  }
  form {
    padding: 1rem;
  }
  input,
  textarea {
    width: 100%;    
    border: 1px solid ${(props) => props.theme.borderColor};
    margin-bottom: 1rem;
    padding: 0.6rem 1rem;
    border-radius: 3px;
    color: ${(props) => props.theme.primaryColor};
  }
  textarea {
    height: 75px;
  }
  .svg {
    fill: ${(props) => props.theme.red};
    height: 22px;
    width: 22px;
    margin-right: 1rem;
    position: relative;
    top: -1px;
  }
  @media screen and (max-width: 600px) {
    .edit-profile {
      width: 90%;
      margin: 4rem auto;
    }
  }
  @media screen and (max-width: 400px) {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const EditProfileModal = ({ closeModal }) => {
  const [data,setD] = useState(JSON.parse(localStorage.getItem("user")));
  const[load,setUpdateLoad] = useState(false);
  const [info,setInfo] = useState({
      fullname:data.fullname,
      username:data.username,
      bio:data.bio||"",
      website:data.website||"",
      cover:data.cover,
      avatar:data.avatar      
  })

  //change state 
  const InputEv = (e)=>{
      console.log(e,info);
      setInfo((prev)=>{
          return { 
          ...prev,
          [e.target.name]:e.target.value
      }})
  }

 

  // handlers for image upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
        if(!file.type.includes("image")){
            return toast.error("Kindly upload an image");
        }
        try{
            let data = await uploadImage({username:JSON.parse(localStorage.getItem("user")).username}, file);
            InputEv({target:{name:"cover",value:data}});
        }
        catch(err){
            
            toast.error("Failed to upload cover photo");
        }
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
        if(!file.type.includes("image")){
            return toast.error("Kindly upload an image");
        }
        try{
            let data = await uploadImage({username:JSON.parse(localStorage.getItem("user")).username}, file);
            InputEv({target:{name:"avatar",value:data}});
        }
        catch(err){
            console.log(err);
            toast.error("Failed to upload avatar");
        }
    }
  };

  const handleEditProfile = () => {
    if (!info.fullname.trim()) {
      return toast.error("fullname should not be empty");
    }

    if (!info.username.trim()) {
      return toast.error("username should not be empty");
    }
    setUpdateLoad(true);

    Connect("/user",{body:info,method:"PUT"}).then((data)=>{
        localStorage.setItem("user",JSON.stringify(data.user));
        setUpdateLoad(false);
        setTimeout(()=>{window.location.reload()},1000);        
        toast.info("Profile updated");        
    }).catch(err=>{
        setUpdateLoad(false);
        toast.error(err.message);
    })   
    
  };

  return (
    <Wrapper>
      <div className="container"></div>
      <div className="edit-profile">
        <div className="modal-header">
          <h3>
            <CloseIcon className="svg" onClick={() => closeModal()} />
            <span>Edit Profile</span>
          </h3>
          <div className="btn" onClick={handleEditProfile}>{load?<CircularProgress size={25} color="primary"/>:"Save"}</div>
        </div>

        <div className="cover-upload-container">
          <label htmlFor="cover-upload">
            <img
              className="pointer"
              width="100%"
              height="200px"
              src={info.cover ? info.cover : defaultcover}
              alt="cover"
            />
          </label>
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            style={{ display: "none" }}
          />
        </div>

        <div className="avatar-upload-icon">
          <label htmlFor="avatar-upload">
            <Avatar
              src={info.avatar}
              className="pointer avatar lg"
              alt="avatar"
            />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: "none" }}
          />
        </div>

        <form>
          <input
            type="text"
            placeholder="Fullname"
            name="fullname"
            value={info.fullname}
            onChange={InputEv}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={info.username}
            onChange={InputEv}
          />
          <input
            type="text"
            name="website"
            placeholder="Add link to your website"
            value={info.website}
            onChange={InputEv}
          />
          <textarea
            type="text"
            placeholder="Tell viewers about your channel"
            name="bio"
            value={info.bio}
            onChange={InputEv}
          />
        </form>
      </div>
    </Wrapper>
  );
};

export default EditProfileModal;