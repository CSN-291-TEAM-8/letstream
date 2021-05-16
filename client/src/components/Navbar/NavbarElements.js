import styled from 'styled-components'
import {NavLink} from 'react-router-dom'


export const Nav = styled.nav`
    background: #000;
    height: 80px;
    font-size: 1rem;
    position: fixed;
    width: 100%;    
    top: 0;
    z-index: 9;
    

    @media screen and (max-width : 960px){
        transition: 0.8s all ease;
    }
`;
// this is to contain the text
export const NavbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 80px;
    z-index: 1;
    width: 100%;
    padding: 0 24px;
    max-width: 1400px;
`;

export const NavLogo = styled(NavLink)`
    color: #e6fff9;
    justify-self: flex-start;
    cursor: pointer;
   
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-right: 32px;
    margin-left: 32px;
    font-weight: bold;
    text-decoration: none;

    
`;

export const MobileIcon = styled.div`
    display: none;

    @media screen and (max-width: 768px){
        display: block;
        position: absolute;
        top: 10px;
        right: 0;
        transform: translate(-100%, 60%);
        cursor: pointer;
        color: #fff;
    }
`;

export const NavMenu = styled.ul`
    display: flex;
    align-items: center;
    list-style: none;
    text-align: center;
    margin-right: -22px;

    @media screen and (max-width: 768px){
        display: none;
    }
`;

export const NavItem = styled.li`
    height: 80px;
`;
export const NavLinks = styled(NavLink)`
    color: #e6fff9;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
        border-bottom: 3px solid #01bf71;
    }

    
`;


