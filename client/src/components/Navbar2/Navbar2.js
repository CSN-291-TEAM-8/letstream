import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import AppsIcon from '@material-ui/icons/Apps';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Avatar from '@material-ui/core/Avatar';
import './Navbar2.css';

function Navbar2(){
    const [inputSearch, setInputSearch] = useState('');

    return (
        <div className='header'>
            <div className="header_left">
                <MenuIcon />
                <Link to='/'>
                    <img
                        className='header_logo'
                        src='https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_of_YouTube_%282015-2017%29.svg'
                        alt=''
                    />
                </Link>
            </div>

            <div className="header_center">
                <input type='text' onChange={(e) =>setInputSearch(e.target.value)} value={inputSearch} />
                <Link to={`serach/${inputSearch}`}>
                    <SearchIcon className='header_searchbutton' />
                </Link>
            </div>

            <div className="header_right">
                <VideoCallIcon className="header_icon" />
                <AppsIcon className="header_icon" />
                <NotificationsIcon className="header_icon" />
                <Avatar
                    alt='Nouman Ahmed'
                    stc='https://avatars1.githubusercontent.com/u/35970677?s=60&v=4'
                />
            </div>
        </div>
    );
}

export default Navbar2;