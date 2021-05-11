import styled from 'styled-components'

export const Container = styled.div`
    height: 770px;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 0;
    background: #e6faff;
    
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
    
    background: #ccf5ff;
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
    color: #000;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
`;


export const FormInput = styled.textarea`
    padding: 16px 16px;
    margin-bottom: 32px;
    border: ridge;
    border-width: 2px;
    border-radius: 4px;
    background: #fff;
    height: 40px;
    font-size: 18px;
`;

export const InputLabel = styled.label`
    margin-bottom: 18px;
    font-size: 18px;
    color: #000;
    border: 1px solid #595959;
    border-radius: 4px;
    display: flex;
    width: 148px;
    padding: 6px 12px;
    cursor: pointer;
`;

export const FormButton = styled.button`
    
    background: #00b386;
    padding: 16px 0;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 24px;
`;

export const TextArea = styled.textarea`
    padding: 16px 16px;
    margin-bottom: 32px;
    border: ridge;
    border-width: 2px; 
    border-radius: 4px;
    background: #fff;
    font-size: 18px;
    height: 100px;
`;

export const UploadInput = styled.input`
    display: none;
`;

export const FormLabel = styled.label`
    margin-bottom: 12px;
    font-size: 18px;
    color: #000;
`;


