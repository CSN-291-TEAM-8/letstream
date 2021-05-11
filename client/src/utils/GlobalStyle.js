import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	html,body {
		font-size: 16px;
		box-sizing: border-box;
		overflow-x:hidden !important;
		user-select: none;
	}
	.Toastify__progress-bar{
		background: linear-gradient(to right,#4535aa,#ed639e) !important;
	}
    .Toastify__toast {
        font-family: sans-serif;
        border-radius: 4px;
		background: #282A36;
        color: "#fff";
      }
      .Toastify__toast--error {
        background: #383838 !important;
      }
      
      
	*, *:before, *:after {
		padding: 0;
		margin: 0;
		box-sizing: inherit;
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
	.footer{
		color: ${(props) => props.theme.primaryColor};
		background: ${(props) => props.theme.footerColor};
		padding: 7px 3px;
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
		font-family: 'Fira Sans', sans-serif;
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