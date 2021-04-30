import React from 'react'
import {FaBars} from 'react-icons/fa'

import {
    Nav,
    NavbarContainer,
    NavLogo,
    MobileIcon,
    NavMenu,
    NavItem,
    NavLinks
} from './NavbarElements'

const Navbar = ({toggle}) => {
    return (
        <>
            <Nav>
                <NavbarContainer>
                    <NavLogo to='/'>LetStream</NavLogo>
                    <MobileIcon onClick = {toggle}>
                        <FaBars/>
                    </MobileIcon>
                    <NavMenu>
                        <NavItem>
                            <NavLinks to='/signup' >Sign Up</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks to='/signin' >Sign In</NavLinks>
                        </NavItem>
                    </NavMenu>
                </NavbarContainer>
            </Nav>
        </>
    )
}

export default Navbar;