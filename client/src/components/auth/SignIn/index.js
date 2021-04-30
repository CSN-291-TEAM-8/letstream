import React,{useState} from 'react'
import { 
    Container, 
    FormContent,
    Form,
    FormButton,
    Text, 
    FormH1, 
    FormInput, 
    FormLabel, 
    FormWrap 
} from './SignInElements'

const SignIn = () => {

    const [data,setData] = useState({
        email: "",
        password: ""
    });

    const [submittedData,setSubmittedData] = useState();

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
                        <FormLabel htmlForm = 'for'>Email</FormLabel>
                        <FormInput 
                        type='email' 
                        placeholder = 'Enter Email'
                        name = "email"
                        onChange = {inputEvent}
                        value = {data.email} 
                        required />
                        <FormLabel htmlFor = 'for'>Password</FormLabel>
                        <FormInput 
                        type='password' 
                        placeholder = 'Enter Password'
                        name = "password"
                        onChange = {inputEvent}
                        value = {data.password} 
                        required />
                        <FormButton type='submit'>Sign In</FormButton>
                        <Text>Fongot password</Text>
                      </Form>
                  </FormContent>
              </FormWrap>
          </Container>  
        </>
    )
}

export default SignIn;