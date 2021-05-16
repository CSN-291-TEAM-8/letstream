import React,{useState} from 'react'
import {useHistory,useLocation} from 'react-router-dom'
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {Connect} from "../../../utils";
import CircularProgress from "@material-ui/core/CircularProgress";


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
import { toast } from 'react-toastify';
import { SubscriberContext } from '../../../utils/SubscriberContext';

export const logout = ()=>{
    localStorage.clear();
    window.location.reload();
}


const SignIn = () => {
    let location = useLocation();
    location = location.state || { next: { pathname: "/" } };
    const [data,setData] = useState({
        email: "",
        password: ""
    });
    
    
    //const [submittedData,setSubmittedData] = useState();
    const {setsubscriber} = React.useContext(SubscriberContext);
    const history = useHistory();
    const handleClick = () => history.push('/AccountRecovery');
    const [showPassword, setValues] = useState(false);
    const [loading,setLoading] = useState(false);
    
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
        if(loading){
            return;
        }
        setLoading(true);
        
        Connect("/auth/login",{body:data}).then((d)=>{
            localStorage.setItem("accesstoken",d.token);
            Connect("/auth/me").then((user)=>{
                if(user.subscribedto){
                    localStorage.setItem("subscription",JSON.stringify(user.subscribedto));
                    setsubscriber(user.subscribedto);
                }
                localStorage.setItem("user",JSON.stringify(user.data));
                window.location.replace(location.next.pathname); 
            }).catch(err=>{
                setLoading(false);
                console.log(err);
            })

        }).catch(err=>{
            setLoading(false);
            toast.error(err.message);
        })
    }
   
    
    return (
        <>
        
          <Container>
              <FormWrap>
                  <FormContent>
                      <Form onSubmit = {onsubmit}>
                        <FormH1>Sign in to your account</FormH1>
                        <FormInput 
                        type='text' 
                        placeholder = 'Username or Email'
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
                        <FormButton type='submit'>{!loading?"Sign In":<CircularProgress size={23}/>}</FormButton>
                        <Text onClick={handleClick}>Forgot password?</Text>
                      </Form>
                  </FormContent>
              </FormWrap>
          </Container>  
        </>
    )
}

export default SignIn;
