import React, { useState } from "react";
import styled,{keyframes} from "styled-components";
import EditProfileModal from "./EditProfileModal";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


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
  animation: ${openModal} 0.5s ease-in-out;
  right:0;
  width:100%;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:2;
  background:${(props)=>props.theme.modalBg};
  .modal-content{
      width:300px;
      background:${(props)=>props.theme.bg};
      cursor:pointer;
      display:flex;
      flex-wrap:wrap;
      
  }
  .choice{
      width:100%;
      padding:15px;
      text-align:center;
      border-bottom: 1px solid ${props=>props.theme.borderColor};
  }
`;
const OptionModal = ({isAdmin,closeModal,switchTheme,deleteUser,changePassword})=>{
    return <ModalWrapper>
            <div className="modal-content">
                    <div className="choice danger" onClick={closeModal}>Cancel</div>
                    <div className="choice" onClick={switchTheme}>Switch theme</div>
                    <div className="choice" onClick={changePassword}>Change password</div>
                    {isAdmin&&<div className="choice danger" onClick={deleteUser}>Delete User</div>}
                    <div className="choice danger" onClick={()=>{localStorage.clear();window.location.reload()}}>log out</div>
            </div>
    </ModalWrapper>
}

const EditProfile = ({isAdmin}) => {  

  const [showModal, setShowModal] = useState(false);
  const [optionModal,showOptionModal] = useState(false);
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

  }
  const changePassword = ()=>{

  }

  return (
    <>
      <Wrapper>
        <div>
          <div className="btn" onClick={() => setShowModal(true)}>
            Edit Profile
          </div>
          <MoreHorizIcon onClick={()=>showOptionModal(true)} />
        </div>
      </Wrapper>
      {showModal && <EditProfileModal closeModal={closeModal} />}
      {optionModal&&<OptionModal closeModal={closeModal} isAdmin={isAdmin} switchTheme={switchTheme}
       deleteUser={deleteUser} changePassword={changePassword}/>}
    </>
  );
};
export default EditProfile;