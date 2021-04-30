import React,{useState} from 'react'

import { 
    Container, 
    FormContent,
    Form,
    FormButton,
    FormH1, 
    FormInput, 
    FormLabel, 
    FormWrap 
} from './SignUpElements'

const SignUp = () => {

    const [data,setData] = useState({
        email: "",
        password: ""
    });

    const [submittedData,setSubmittedData] = useState();

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
                        <FormLabel htmlForm = 'for'>Email</FormLabel>
                        <FormInput 
                        type='email' 
                        placeholder = 'Enter Email' 
                        onChange = {inputEvent}
                        name = "email"
                        value = {data.email}
                        required />
                        <FormLabel htmlFor = 'for'>Password</FormLabel>
                        <FormInput 
                        type='password' 
                        placeholder = 'Enter Password' 
                        onChange = {inputEvent}
                        name = "password"
                        value = {data.password}
                        required />
                        <FormButton type='submit'>Sign Up</FormButton>
                      </Form>
                  </FormContent>
              </FormWrap>
          </Container>  
        </>
    )
}

export default SignUp;