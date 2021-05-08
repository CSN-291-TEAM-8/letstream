import React,{useState} from 'react'
import { useHistory } from 'react-router'
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

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


const AccountRecovery = () => {

    const history = useHistory();
    const [data,setData] = useState({
        email:"",
        password:"",
        otp: ""
    });
    const [isRequestOTPClicked,hideEmail] = useState(false);
    const [submittedData,setSubmittedData] = useState();
    const [showPassword, setValues] = useState(false);

    
    const handleClickShowPassword = () => {
      setValues(!showPassword );
    };
      
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
      
    
    const inputEvent = (e) => {
        const {name,value} = e.target;

        setData((preValue) => {
            return {
                ...preValue,
                [name] : value
            }
        })
    }

    const onsubmit = (e) => {
        e.preventDefault();
        setSubmittedData(data);
    }
    return (
        <>
          <Container>
              <FormWrap>
                  <Icon to="/">LetStream</Icon>
                  <FormContent>
                      <Form onClick={onsubmit}>
                          <FormH1>Recover your account</FormH1>
                          {!isRequestOTPClicked&& <>
                            <FormInput
                                type = "email"
                                placeholder = "Enter your email"
                                name = "email"
                                value = {data.email}
                                onChange = {inputEvent}
                                disableUnderline={true}
                            >
                            </FormInput>
                            <FormButton type="submit" onClick={ () => {hideEmail(true)}}>Request OTP</FormButton>
                          </>
                          }
                          {isRequestOTPClicked && 
                            <>
                            <FormInput
                                type = {showPassword ? "text" : "password"}
                                placeholder = "Enter new password"
                                name = "password"
                                value = {data.password}
                                onChange = {inputEvent}
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
                                type = "number"
                                placeholder = "Enter 6-digit OTP"
                                name = "email"
                                min ="100000"
                                max = "999999"
                                name="otp"
                                value = {data.otp}
                                onChange = {inputEvent}
                                disableUnderline={true}
                            >
                            </FormInput>
                            <FormButton type="submit">Submit</FormButton>
                            <FormButton type="submit">Resend OTP</FormButton> 
                            </>
                          }
                          <FormFooter>Back to login?<Text onClick={() => history.goBack()}> click</Text></FormFooter>
                      </Form>
                  </FormContent>
              </FormWrap>
          </Container>  
        </>
    )
}

export default AccountRecovery;
