import React,{useState} from 'react'
import SignIn from '../components/auth/SignIn/index'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar/Smaller_device/index'
const SignInPage = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <>
           <Sidebar isOpen = {isOpen} toggle={toggle} />
           <Navbar toggle = {toggle}/>
           <SignIn/>
        </>
    )
}

export default SignInPage;