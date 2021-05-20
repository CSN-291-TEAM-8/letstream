import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import LiveTvOutlinedIcon from '@material-ui/icons/LiveTvOutlined';
//import AppsIcon from '@material-ui/icons/Apps';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Avatar from '@material-ui/core/Avatar';
import './Navbar2.css';
import letstreamlogo from "../../assets/tempsnip.png";

function Navbar2(){
    const [inputSearch, setInputSearch] = useState('');
    const history = useHistory();
    const [myinfo,setInfo] = useState(JSON.parse(localStorage.getItem("user")));
    const onSearchInputChange = (e)=>{
        if(e.keyCode===13){
            history.push(`/video/search/${inputSearch}`);
        }
    }
    return (
        <div className='header'>
            <div className="header_left">
                <MenuIcon />
                <Link to='/'>
                    <img
                        className='header_logo'
                        src={letstreamlogo}
                        alt=''
                    />
                </Link>
            </div>

            <div className="header_center">
                <input type='text' placeholder="Search" onChange={(e)=>setInputSearch(e.target.value)} onKeyDown={onSearchInputChange} value={inputSearch} />
                <Link to={`/video/search/${inputSearch}`}>
                    <SearchIcon className='header_searchbutton' />
                </Link>
            </div>

            <div className="header_right">
                <Link to="/user/uploadvideo">
                    <VideoCallIcon className="header_icon" title="Upload a video"/>
                </Link>
                <Link to="/user/startlive">
                    <LiveTvOutlinedIcon className="header_icon sp" title="Go live"/>
                </Link>
                <Link to="/user/notifications">
                <NotificationsIcon className="header_icon" title="Notifications"/>
                <div className="upper-wrapper" id="noti-wrapper" style={{display: "none"}}>
                    <div className="middle-wrapper">
                        <div className="lower-wrapper" id="noti-count">

                        </div>
                    </div>
                </div>
                </Link>
                <Link to={`/user/${myinfo._id}`}>
                <Avatar
                    alt='Nouman Ahmed'
                    src={myinfo.avatar}
                />
                </Link>
            </div>
        </div>
    );
}

export default Navbar2;