import React,{useState} from 'react'
import Video from '../../assets/video.mp4'
import {Button} from '../ButtonElements'
import {
    HeroContainer,
    HeroBg,
    VideoBg,
    HeroContent,
    HeroH1,
    HeroP,
    HeroBtnWrapper,
    ArrowForward,
    ArrowRight
} from './IntroElements'


const IntroSection = () => {
    const [hover, setHover] = useState(false);

    const onHover = () => {
        setHover(!hover);
    }
    return (
        <HeroContainer>
            <HeroBg>
                <VideoBg autoPlay loop muted src={Video} type='video/mp4'/>
            </HeroBg>
            <HeroContent>
                <HeroH1>Online Streaming Made Easy</HeroH1>
                <HeroP>
                    This is a place where you can start a live stream,
                    upload videos of your choice.
                </HeroP>
                <HeroBtnWrapper>
                    <Button to = '/signup' 
                        onMouseEnter = {onHover}
                        onMouseLeave = {onHover}
                        primary = 'true'
                        dark = 'true'>
                        Get started {hover ? <ArrowForward/> : <ArrowRight/>}
                    </Button>
                </HeroBtnWrapper>
            </HeroContent>
        </HeroContainer>
    )
}

export default IntroSection;