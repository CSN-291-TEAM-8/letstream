import React,{useState} from 'react'
import SignUp from '../components/auth/SignUp/index'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar/Smaller_device/index'
const SignUpPage = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <>
           <Sidebar isOpen = {isOpen} toggle={toggle} />
           <Navbar toggle = {toggle}/>
           <SignUp/> 
        </>
    )
}

export default SignUpPage;