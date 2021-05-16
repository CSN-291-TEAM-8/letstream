import styled from 'styled-components'

export const Container = styled.div`
    height: auto;
    width:100%;   
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 0;
    
    video{
        width:100%;
        height:300px;
        object-fit:cover;
    }
    
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
    
    
    max-width: 400px;
    height: auto;
    width: 100%;
    z-index: 1;
    display: grid;
    margin: 0 auto;
    padding: 80px 32px;
    border-radius: 4px;
    
    @media screen and(max-width: 400px){
        padding: 32px 32px;
    }
`;

export const FormH1 = styled.h1`
    margin-bottom: 40px;
    
    font-size: 20px;
    font-weight: 400;
    text-align: center;
`;


export const FormInput = styled.textarea`
    padding: 16px 16px;
    margin-bottom: 32px;
    border: 1px solid #595959;
    
    border-radius: 4px;
    
    height: 55px;
    font-size: 18px;
    
`;

export const FormSearchInput = styled.input`
    padding: 16px 16px;
    margin-bottom: 32px;
    border: 1px solid #595959; 
    border-radius: 4px;
    font-size: 16px;
    height: 53px;
`;

export const InputLabel = styled.label`
    margin-bottom: 18px;
    font-size: 18px;
    
    border: 1px solid #595959;
    border-radius: 4px;
    display: flex;
    align-items:center;
    width: 100%;
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
    border: 1px solid #595959;
     
    border-radius: 4px;
    
    font-size: 18px;
    height: 100px;
`;

export const UploadInput = styled.input`
    display: none;
`;

export const FormLabel = styled.label`
    margin-bottom: 12px;
    font-size: 18px;
    
`;


