import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Container,
  FormContent,
  Form,
  FormButton,
  FormH1,
  FormInput,
  FormWrap
} from './SignUpElements'
import { Connect } from '../../../utils';


const SignUp = () => {

  const [data, setData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    otp: ""
  });
  //{!loading?"Request OTP":<CircularProgress size={24}/>}

  
  const [loading, setLoading] = useState(false);
  const [isSingUpEnabled, enableSignUpBtn] = useState(false);
  const [isOTPEntry, showOTPInput] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [val, setval] = useState("Request OTP");
  // const [submittedData, setSubmittedData] = useState();
  const [showPassword, setValues] = useState(false);


  const handleClickShowPassword = () => {
    setValues(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const RequestOTPClicked = async (e) => {
    if (loading) {
      return;
    }
    setDisabled(true);

    if (!data.email || !data.email.includes("iitr.ac.in")) {
      setDisabled(false);
      return toast.error("Please use your institute email id");
    }

    setLoading(true);

    Connect("/auth/OTPrequest", { body: { email: data.email } }).then(() => {
      showOTPInput(true);
      setDisabled(false);
      setLoading(false);
      setval("Resend OTP");
      return toast.success("Enter the 6 digit OTP sent to your email");
    }).catch(err => {
      setLoading(false);
      setDisabled(false);
      return toast.error(err.message);
    });
  }
  const OTPinput = (e) => {

    if (document.getElementById('OTP').value.toString().length === 6) {
      enableSignUpBtn(true);
    }
    else {
      enableSignUpBtn(false);
    }
    return;
  }



  const inputEvent = (event) => {

    const { name, value } = event.target;
    setData((preValue) => {

      return {
        ...preValue,
        [name]: value,
      }
    });
  }

  const submitData = (event) => {
    event.preventDefault();
    if(loading){
      return;
    }
    if (!data.email || !data.password || !data.username || !data.fullname||!data.otp) {
      return toast.error("Please fill in all the fields");
  }


  const re = /^[a-z0-9]+$/i;
  if (re.exec(data.username) === null) {
      return toast.error(
          "The username can only contain letter and digits"
      );
  }
  if (data.username.length < 6) {
      return toast.error(
          "username should be atleast 6 character long, please try again"
      )
  }
  if (data.password.length < 6) {
      return toast.error(
          "Password should be minimum of 6 characters in length"
      )
  }
  if (data.username=== 'highlight' || data.username === "search") {
      return toast.error(
          "This username is not available"
      )
  }
  if (data.email.indexOf("iitr.ac.in") === -1) {
      return toast.error(
          "IITR email id is required"
      )
  }

  const body = {
      email: data.email,
      password: data.password,
      username: data.username,
      fullname: data.fullname,
      OTP: data.otp,      
  };
  console.log(body);
  setLoading(true);
  Connect("/auth/signup",{body}).then((data)=>{
    localStorage.setItem("accesstoken", data.token);
    Connect("/auth/me").then((user)=>{
      
      localStorage.setItem("user",JSON.stringify(user.data));
      window.location.replace("/");
    }).catch(err=>{
      setLoading(false);
      return toast.error(err.message);
    })
  }).catch(err=>{
    setLoading(false);
    return toast.error(err.message);
  })
  }
  return (
    <>
      <Container>
        <FormWrap>
          <FormContent>
            <Form onSubmit={submitData}>
              <FormH1>Sign Up Here</FormH1>
              <FormInput
                type='text'
                placeholder='Enter FullName'
                onChange={inputEvent}
                name="fullname"
                value={data.fullname}
                disableUnderline={true}
                required />
              <FormInput
                type='text'
                placeholder='Enter UserName'
                onChange={inputEvent}
                name="username"
                value={data.username}
                disableUnderline={true}
                required />
              <FormInput
                type='email'
                placeholder='Enter Email'
                onChange={inputEvent}
                name="email"
                value={data.email}
                disableUnderline={true}
                required />
              <FormInput
                type={showPassword ? "text" : "password"}
                placeholder='Enter Password'
                onChange={inputEvent}
                name="password"
                value={data.password}
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
                required />
              {isOTPEntry &&
                <FormInput
                  type="number"
                  placeholder='Enter 6-digit OTP'
                  id="OTP"
                  min="100000"
                  max="999999"
                  onChange={inputEvent}
                  name="otp"
                  value={data.otp}
                  onInput={OTPinput}
                  disableUnderline={true}
                  required />
              }
              {!isSingUpEnabled &&
                <FormButton
                  type="button"
                  style={{
                    background: "#9999ff",
                    padding: "12px 0",
                    border: "none",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "20px",
                    cursor: "pointer"
                  }}
                  onClick={RequestOTPClicked}
                >
                  {!loading ? val : <CircularProgress size={20} />}
                </FormButton>
              }
              {isSingUpEnabled &&
                <FormButton type='submit'>{!loading ? "Sign up" : <CircularProgress size={20} />}</FormButton>
              }

            </Form>
          </FormContent>
        </FormWrap>
      </Container>
    </>
  )
}

export default SignUp;