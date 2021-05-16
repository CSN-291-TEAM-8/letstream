import React, { useState } from 'react'
import { useHistory } from 'react-router'
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Navbar from '../../Navbar'
import CircularProgress from '@material-ui/core/CircularProgress';
import Sidebar from '../../Sidebar/Smaller_device/index'

import {
    Container,
    FormContent,
    FormWrap,
    Form,
    FormH1,
    FormInput,
    FormButton,
    FormFooter,
    Text,
    Icon
} from './SignInElements'
import { Connect } from '../../../utils';
import { toast } from 'react-toastify';
import { SubscriberContext } from '../../../utils/SubscriberContext';


const AccountRecovery = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }
    const [loading,setLoading] = useState(false);

    const history = useHistory();
    const [data, setData] = useState({
        email: "",
        password: "",
        otp: ""
    });
    const [isRequestOTPClicked, hideEmail] = useState(false);
    //const [submittedData, setSubmittedData] = useState();
    const [showPassword, setValues] = useState(false);
    const {setsubscriber} = React.useContext(SubscriberContext);

    const handleClickShowPassword = () => {
        setValues(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const inputEvent = (e) => {
        const { name, value } = e.target;

        setData((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }

    const onsubmit = (e) => {
        e.preventDefault();
        //setSubmittedData(data);
        if(loading){
            return;
        }
        console.log(data);
        if(!data.otp||!data.password){
            return toast.info("Please fill all fields");
        }
        setLoading(true);
        const body = {
            email: data.email,
            password: data.password,
            OTP: parseInt(data.otp)
        }
        Connect('/auth/forgetpassword', { body }).then((data) => {
            console.log(data);
            if(data.subscribedto){
                localStorage.setItem("subscription",JSON.stringify(data.subscribedto));
                setsubscriber(data.subscribedto);
            }
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('accesstoken', data.token);
            window.location.replace("/");            
        }).catch(err => {
            setLoading(false);
            return toast.error(err.message);
        })

    }

    const onOTPrequest = (e)=>{
        e.preventDefault();
        if(loading){
            return;
        }
        if(!data.email){
            return toast.info("Please enter your email");
        }
        if(!data.email.includes("iitr.ac.in")){
            return toast.info("IITR email id is required");
        }
        setLoading(true);
        Connect("/auth/recoveryOTP",{body:{email:data.email}}).then(()=>{
            setLoading(false);
            hideEmail(true);
            return toast.success("Enter the otp you just received on your email");
        }).catch(err=>{
            setLoading(false);
            return toast.error(err.message);
        })
    }
    return (
        <>
            <>
                <Sidebar isOpen={isOpen} toggle={toggle} />
                <Navbar toggle={toggle} />
                <>
                    <Container>
                        <FormWrap>
                            <Icon to="/">LetStream</Icon>
                            <FormContent>
                                <Form onSubmit={onsubmit}>
                                    <FormH1>Recover your account</FormH1>
                                    {!isRequestOTPClicked && <>
                                        <FormInput
                                            type="email"
                                            placeholder="Enter your email"
                                            name="email"
                                            value={data.email}
                                            onChange={inputEvent}
                                            disableUnderline={true}
                                        >
                                        </FormInput>
                                        <FormButton type="button" onClick={onOTPrequest}>{!loading?"Request OTP":<CircularProgress size={20}/>}</FormButton>
                                    </>
                                    }
                                    {isRequestOTPClicked &&
                                        <>
                                            <FormInput
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                name="password"
                                                value={data.password}
                                                onChange={inputEvent}
                                                disableUnderline={true}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            >
                                            </FormInput>
                                            <FormInput
                                                type="number"
                                                placeholder="Enter your email-OTP"                                           
                                                min="100000"
                                                max="999999"
                                                name="otp"
                                                value={data.otp}
                                                onChange={inputEvent}
                                                disableUnderline={true}
                                            >
                                            </FormInput>
                                            <FormButton type="submit">{!loading?"Submit":<CircularProgress size={23}/>}</FormButton>
                                            <FormButton type="button" onClick={onOTPrequest}>{!loading?"Resend OTP":<CircularProgress size={23}/>}</FormButton>
                                        </>
                                    }
                                    <FormFooter>Back to login?<Text onClick={() => history.goBack()}> click</Text></FormFooter>
                                </Form>
                            </FormContent>
                        </FormWrap>
                    </Container>
                </>
            </>


        </>
    )
}

export default AccountRecovery;
