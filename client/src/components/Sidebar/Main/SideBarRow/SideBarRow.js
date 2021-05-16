import { Avatar } from '@material-ui/core';
import React from 'react';
import {NavLink} from "react-router-dom";
import './SideBarRow.css';

const SideBarRow = ({ selected, Icon, title, avatar, url }) => {
    return (
        <NavLink                    
            to={url}
            activeClassName="selected"
        >
            <div className={`sidebarrow ${selected ? 'selected' : ''}`} title={title}>
                {!avatar ? <Icon className='sidebarrow__icon' /> : <Avatar src={avatar} />}
                <h2 className='sidebarrow__title'>{title}</h2>
            </div>
        </NavLink>
    )
}

export default SideBarRow;
