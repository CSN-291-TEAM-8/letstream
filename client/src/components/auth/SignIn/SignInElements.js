import styled from 'styled-components'
import img from '../../../assets/auth4.jpeg'
import Input from "@material-ui/core/Input";
import {NavLink} from 'react-router-dom'

export const Container = styled.div`
    height: 770px;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 0;
    background-image: url(${img});
    background-size : cover
    

`;

export const FormWrap = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media screen and(max-width: 460px){
        height: 80%;
    }
`;


export const FormContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media screen and(max-width: 480px){
        padding: 10px;
    }
`;

export const Form = styled.form`
    
    background-image: url(${img});
    max-width: 400px;
    height: auto;
    width: 100%;
    z-index: 1;
    display: grid;
    margin: 0 auto;
    padding: 80px 32px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

    @media screen and(max-width: 400px){
        padding: 32px 32px;
    }
`;

export const FormH1 = styled.h1`
    margin-bottom: 40px;
    color: #e6fff9;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
`;


export const FormInput = styled(Input)`
    padding: 16px 16px;
    margin-bottom: 32px;
    border: none;
    border-radius: 4px;
    background: #e6fff9 !important;
    height: 50px;
    
`;

export const FormButton = styled.button`

    ${'' /* background: #01bf71; */}
    background: #9999ff;
    padding: 12px 0;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 24px;
`;

export const Text = styled.span`
    text-align: center;
    margin-top: 24px;
    color: #e6fff9;
    font-size: 16px;
    text-decoration: underline;
    cursor: pointer;
    font-weight: bold;

`;

export const FormFooter = styled.div`
    text-align: center;
    margin-top: 24px;
    color: #e6fff9;
    font-size: 16px;
`

export const Icon = styled(NavLink)`
    margin-Left: 32px;
    margin-top: 32px;
    text-decoration: none;
    color: #fff;
    font-weight: 700;
    font-size: 32px;

    @media screen and(max-width: 480px){
        margin-left: 16px;
        margin-top: 8px;
    }
`