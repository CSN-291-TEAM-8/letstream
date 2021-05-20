import React, { useState } from "react";
import styled,{keyframes} from "styled-components";
import EditProfileModal from "./EditProfileModal";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Connect from "../../utils";
import { toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";


const Wrapper = styled.div`
  svg {
    width: 30px;
    height: 30px;
    margin-left: 1rem;
    fill: ${(props) => props.theme.darkGrey};
  }
  div {
    display: flex;
    align-items: center;
  }
  @media screen and (max-width: 440px) {
    margin-top: 1rem;
  }
`;

const openModal = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

export const ModalWrapper = styled.div`
  position:fixed;
  top:0;
  left:0;  
  bottom:0;
  z-index:200 !important;
  animation: ${openModal} 0.5s ease-in-out;
  right:0;
  width:100%;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:5;
  background:${(props)=>props.theme.modalBg};
  .usersearchresult{
    top:-15px;
  }
  .modal-content{
      width:300px;
      background:${(props)=>props.theme.bg};
      cursor:pointer;
      display:flex;
      flex-wrap:wrap;
      
  }
  .modal-content2{
    width:360px;
    background:${(props)=>props.theme.bg};
    cursor:pointer;
    display:flex;
    flex-wrap:wrap;
    
}
  .text{
    padding:20px;
    padding-bottom:0px;
  }
  select{
    margin-top:0px;
    margin:20px;
  }
  .sel{
    width:100%;
    margin-top:0;
  }
  textarea{
    width:100%;
    border:1px solid ${(props)=>props.theme.borderColor};
    border-top:0;
    margin:15px 0px;
    height:40px;
  }
  .choice{
      width:100%;
      padding:20px 15px;
      text-align:center;
      border-bottom: 1px solid ${props=>props.theme.borderColor};
  }
  .choice-btn{
    display:flex;
    justify-content:space-between;
    width:100%;
  }
  .modalbtn{
    padding:5px 10px;
    width:80px;
    color:white;
    text-align:center;
    border-radius:8px;
    margin:2px 10px;
    margin-bottom:10px;
  }
  .btndanger{
    color:white;
    background:#f00;
  }

  input{
    padding:10px !important;
    width:100%;
    margin:15px 0px;
    border:1px solid ${props=>props.theme.borderColor};
    border-top:0;
  }
  
  .btnsuccess{
    background:#0f0;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .fullchoice-btn{
    width:100%;
    padding:15px;
    color:white;
    background:#0f0;
  }
`;
const OptionModal = ({isAdmin,isMe,closeModal,switchTheme,deleteUser,changePassword})=>{
    return <ModalWrapper>
            <div className="modal-content">
                    <div className="choice danger" onClick={closeModal}>Cancel</div>
                    {isMe&&<div className="choice" onClick={switchTheme}>Switch theme</div>}
                    {isMe&&<div className="choice" onClick={changePassword}>Change password</div>}
                    {(isAdmin||isMe)&&<div className="choice danger" onClick={deleteUser}>Delete Account</div>}
                    <div className="choice danger" onClick={()=>{localStorage.clear();window.location.reload()}}>log out</div>
            </div>
    </ModalWrapper>
}

const EditProfile = ({isAdmin,isMe,_id}) => {  

  const [showModal, setShowModal] = useState(false);
  const [optionModal,showOptionModal] = useState(false);
  const [changepassword,setChangePwdOTP] = useState(false);
  const [otp,setOTP] = useState("");
  const [load,setLoad] = useState(false);
  const [password,setPassword] = useState("");
  const closeModal = () => {
      setShowModal(false);
      showOptionModal(false);
    }

  

  const switchTheme = ()=>{
      if(localStorage.getItem("themepreference")==="light"){
          localStorage.setItem("themepreference","dark");
      }
      else{
        localStorage.setItem("themepreference","light");
      }
      window.location.reload();
  }

  const deleteUser=()=>{
    const t = window.confirm("Are you sure about your decision?");
    if(t){
      Connect(`/admin/deleteUserId/${_id}`,{method:"POST"}).then(d=>{
        window.location.replace("/")
      }).catch(err=>toast.error(err.message))
    }
  }

  const changePassword = ()=>{
    Connect("/user/requestpasswordotp",{method:"POST"}).then(d=>{
      showOptionModal(false);
      setChangePwdOTP(true);      
      toast.success("Enter the otp sent to your mail");
    }).catch(err=>toast.error(err.message))
  }

  const changePasswordSubmit = ()=>{
    if(password.length<6||password.length>20){
      return toast.error("Password length must be between 6 and 20");
    }
    if(load){
      return;
    }
    setLoad(true);
    Connect("/user/changepassword",{body:{otp:otp,password:password}}).then(d=>{
      localStorage.setItem("accesstoken",d.token);
      setChangePwdOTP(false);
      setLoad(false);
      toast.success("Password changed successfully")
    }).catch(err=>{
      setLoad(false);
      toast.error(err.message);
    })
  }

  return (
    <>
      <Wrapper>
        <div>
          {isMe&&<div className="btn" onClick={() => setShowModal(true)}>
            Edit Profile
          </div>}
          {(isAdmin||isMe)&&<MoreHorizIcon onClick={()=>showOptionModal(true)} />}
        </div>
      </Wrapper>
      {showModal && <EditProfileModal closeModal={closeModal} />}
      {changepassword&&<ModalWrapper>
          <div className="modal-content">
            <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter new password"/>
            <input type="number" value={otp} onChange={(e)=>setOTP(e.target.value)} placeholder="Enter OTP"/>
            <div className="choice-btn">
                <div className="modalbtn btndanger" onClick={()=>setChangePwdOTP(false)}>Cancel</div>
                <div className="modalbtn btnsuccess" onClick={changePasswordSubmit}>{load?<CircularProgress size={20}/>:"Submit"}</div>
              </div>            
          </div>
        </ModalWrapper>}
      {optionModal&&<OptionModal closeModal={closeModal} isAdmin={isAdmin} switchTheme={switchTheme}
       deleteUser={deleteUser} changePassword={changePassword} isMe={isMe}/>}
    </>
  );
};
export default EditProfile;