import React,{useState} from 'react'
import {toast} from 'react-toastify'
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { 
    Container, 
    FormContent,
    Form,
    FormButton,
    FormH1, 
    FormInput,
    FormWrap 
} from './SignUpElements'

const SignUp = () => {

    const [data,setData] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        otp: ""
    });
    
    const [isSingUpEnabled,enableSignUpBtn] = useState(false);
    const [isOTPEntry,showOTPInput] = useState(false);
    const [isDisabled,setDisabled] = useState(false);
    const [val,setval] = useState("Request OTP");
    const [submittedData,setSubmittedData] = useState();
    const [showPassword, setValues] = useState(false);

    
    const handleClickShowPassword = () => {
      setValues(!showPassword );
    };
      
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
      
    const RequestOTPClicked = async(e)=>{  
        setDisabled(true);
      if(!data.email || !data.email.includes("iitr.ac.in")){
        setDisabled(false);
        return toast.error("Please use your institute email id");
      }

      showOTPInput(true);
      setDisabled(false);
      setval("Resend OTP");    
      return toast.success("Enter the 6 digit OTP sent to your email");
    }
    const OTPinput = (e)=>{
     
      if(document.getElementById('OTP').value.toString().length===6){
        enableSignUpBtn(true);
      }
      else{
        enableSignUpBtn(false);
      }
      return;
    }

    

    const inputEvent = (event) => {
        
        const { name, value} = event.target;
        setData((preValue) => {
            
            return{
                ...preValue,
                [name] : value,
            }
        });
    }

    const submitData = (event) => {
        event.preventDefault();
        setSubmittedData(data);
    }   
    return (
        <>
          <Container>
              <FormWrap>
                  <FormContent>
                      <Form onSubmit = {submitData}>
                        <FormH1>Sign Up Here</FormH1>
                        <FormInput 
                        type='text' 
                        placeholder = 'Enter FullName' 
                        onChange = {inputEvent}
                        name = "fullname"
                        value = {data.fullname}
                        disableUnderline={true}
                        required />
                        <FormInput 
                        type='text' 
                        placeholder = 'Enter UserName' 
                        onChange = {inputEvent}
                        name = "username"
                        value = {data.username}
                        disableUnderline={true}
                        required />
                        <FormInput 
                        type='email' 
                        placeholder = 'Enter Email' 
                        onChange = {inputEvent}
                        name = "email"
                        value = {data.email}
                        disableUnderline={true}
                        required />
                        <FormInput 
                        type={showPassword ? "text" : "password"}
                        placeholder = 'Enter Password' 
                        onChange = {inputEvent}
                        name = "password"
                        value = {data.password}
                        disableUnderline={true}
                        endAdornment = {
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
                        {isOTPEntry&&
                            <FormInput 
                            type="number" 
                            placeholder = 'Enter 6-digit OTP'
                            id = "OTP"
                            min = "100000" 
                            max = "999999"
                            onChange = {inputEvent}
                            name = "otp"
                            value = {data.otp}
                            onInput = {OTPinput}
                            disableUnderline={true}
                            required />     
                        }
                        {!isDisabled&&!isSingUpEnabled&&
                            <FormInput 
                            type="button" 
                            style = {{background: "#9999ff",
                                      padding: "16px 0",
                                      border: "none",
                                      borderRadius: "4px",
                                      color: "#fff",
                                      fontSize: "20px",
                                      cursor: "pointer"}}
                            value = {val}
                            disabled = {isDisabled}
                            onClick = {RequestOTPClicked}
                            disableUnderline={true}
                            required />
                        }
                        {isSingUpEnabled&&       
                            <FormButton type='submit'>Sign Up</FormButton>
                        }
                        
                      </Form>
                  </FormContent>
              </FormWrap>
          </Container>  
        </>
    )
}

export default SignUp;