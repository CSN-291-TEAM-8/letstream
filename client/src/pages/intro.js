import React, {useState}from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar/Smaller_device/index'
import IntroSection from '../components/IntroSection/index'

const Intro = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <>
            <Sidebar isOpen = {isOpen} toggle={toggle} />
            <Navbar toggle = {toggle}/>
            <IntroSection/>
        </>
    )
}

export default Intro;