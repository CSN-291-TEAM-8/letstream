import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	::-webkit-scrollbar {
		width: 10px;
  	}
  
 
    ::-webkit-scrollbar-track {
		background: dark;
  	}
  
  
  	::-webkit-scrollbar-thumb {
		background: gray;
  	}

	html,body {
		font-size: 16px;
		box-sizing: border-box;
		// overflow:hidden !important;
		user-select: none;
	}
	.Toastify__progress-bar{
		background: linear-gradient(to right,#4535aa,#ed639e) !important;
	}
	.recommendedvideos,.history,.live,.Suggestions,.myvideos,.savedvideos,.likedvideos,
	.notifications,.channelPage,.searchvideos{
		//max-height:calc(100vh - 80px);
    	//overflow-y:auto;
	}
    .Toastify__toast {
        font-family: 'Lora', serif;
        border-radius: 4px;
		background: #282A36;
        color: "#fff";
      }
      .Toastify__toast--error {
        background: #383838 !important;
      }
      
      .selected{
		  background-color:${(props) => props.theme.light ? "" : `${props.theme.selected} !important`}
	  }
	  .sidebar{
		  background:${(props) => props.theme.light ? "#fff":"#000"};
		  z-index:2;
	  }
	.sidebarrow:hover{
		background-color:${(props) => props.theme.light ? "" : `${props.theme.hoverColor} !important`}
	}
	select {
		margin-bottom: 20px;
		cursor:pointer;
		background: ${(props)=>props.theme.bg};
		border: 1px solid ${(props)=>props.theme.borderColor};
		color: ${(props)=>props.theme.primaryColor};
		padding: 10px;
	}
	hr{
		background-color:${(props) => props.theme.light ? "" : `${props.theme.borderColor} !important`}
	}
	.header,.header_center{
		background-color:${(props) => props.theme.light ? "" : props.theme.bg + " !important"};
		border:${(props) => props.theme.light ? "auto" : "1px solid "+props.theme.borderColor + " !important"};
		
	}
	.header{
		background-color:${(props) => props.theme.light ? "#fff !important" : "#000 !important"};
	}
	input{
		background-color:${(props) => props.theme.light ? "" :localStorage.getItem("user")? props.theme.bg + " !important":""};
		color:${(props) => props.theme.light ? "" :localStorage.getItem("user")? props.theme.primaryColor + " !important":""};
	}
	.recommendedvideos{
		background-color:${(props) => props.theme.light ? "" : props.theme.bg + " !important"};
	}

	
	*, *:before, *:after {
		padding: 0;
		margin: 0;
		box-sizing: inherit;
	}
	*{
		scrollbar-color: #555555 #898B8C;
		scroll-behavior: smooth;
	}
	.notification-badge {
	top: 3px;
	right: 15px;
	transform: scale(0.7);	
	height: 20px;
	background-color: red;
	border-radius: 50%;
	width: 22px;
	height: 25px;
	display: inline-block;
	position: relative;
	text-align: center;
}
.notice-footer{
	font-size:14px !important;
}
#root{
	display:${() => localStorage.getItem("user") ? "flex" : ""};
	
}

	textarea{
		color: ${(props) => props.theme.primaryColor};
		background: ${(props) => props.theme.bg};
		padding:0.8rem 10px !important;
		scrollbar-width:none;
		ms-overflow-style:none;		
			
	}
	textarea::-webkit-scrollbar{
		display:none;
	}
	.submit-cmnt{
		color:#2f2fc1;
	}
	.add-comment{
		background: ${(props) => props.theme.bg};	
	}
	.newpost-header textarea{
		height:50px !important;
		position:absolute;
		bottom:0px;
	}
	.modal-content:first-child{
		border:1px solid ${(props) => props.theme.primaryColor} !important;
	}
	body {
		font-family: 'Lora', serif;
		font-size: 1rem;
		line-height: 1.7;
		background: ${(props) => props.theme.bg};
		color: ${(props) => props.theme.primaryColor};
		overflow-x: hidden;
	}
	h1, h2, h3, h4, h5, h6 {
		font-weight: normal;
	}
	svg[aria-label="loader"]{
		width:60px !important;
		height:60px !important;
	}
	input{
		border:0;
		outline:0;
		padding:6px;
		padding-left:15px;
	}
	a {
		text-decoration: none;
		cursor: pointer;
		color: inherit;
	}
	.pointer {
		cursor: pointer;
	}
	.secondary {
		color: ${(props) => props.theme.secondaryColor};
	}
	center {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin-top: 200px;
	}
	 .usersearchresult{
		width: 100%;
		cursor:pointer;
		max-height: 200px;
		position: relative;
		top: -32px;
		z-index: 2;
		border: 1px solid #535353;
		box-shadow: 5px 2px 10px #535353;
		overflow-y: scroll;
	}
	.unsubscribe-btn{
		background: transparent !important;
		color:gray;
		border:2px solid ${(props)=>props.theme.borderColor};
	  }
	.danger {
		color: ${(props) => props.theme.red};
	}
	button, svg {
	  cursor: pointer;
	}
	.bold {
		font-weight: 500;
	}
	*:focus {
	  outline: none;
	}
`;

export default GlobalStyle;