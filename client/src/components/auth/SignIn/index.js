import React,{useState} from 'react'
import {useHistory} from 'react-router-dom'
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";


import { 
    Container, 
    FormContent,
    Form,
    FormButton,
    Text, 
    FormH1, 
    FormInput, 
    FormWrap 
} from './SignInElements'


const SignIn = () => {

    const [data,setData] = useState({
        email: "",
        password: ""
    });

    
    const [submittedData,setSubmittedData] = useState();
    const history = useHistory();
    const handleClick = () => history.push('/AccountRecovery');
    const [showPassword, setValues] = useState(false);

    
    const handleClickShowPassword = () => {
      setValues(!showPassword );
    };
      
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
      
    
    const inputEvent = (event) => {
        const {name, value} = event.target;

        setData((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        });
    }

    const onsubmit = (event) => {
        event.preventDefault();
        setSubmittedData(data);
    }
   
    
    return (
        <>
          <Container>
              <FormWrap>
                  <FormContent>
                      <Form onSubmit = {onsubmit}>
                        <FormH1>Sign in to your account</FormH1>
                        <FormInput 
                        type='email' 
                        placeholder = 'Enter Email'
                        name = "email"
                        onChange = {inputEvent}
                        value = {data.email} 
                        disableUnderline={true}
                        required />
                        <FormInput 
                        type={showPassword ? "text" : "password"}
                        placeholder = 'Enter Password'
                        name = "password"
                        onChange = {inputEvent}
                        value = {data.password} 
                        disableUnderline= {true}
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
                        <FormButton type='submit'>Sign In</FormButton>
                        <Text onClick={handleClick}>Forgot password?</Text>
                      </Form>
                  </FormContent>
              </FormWrap>
          </Container>  
        </>
    )
}

export default SignIn;