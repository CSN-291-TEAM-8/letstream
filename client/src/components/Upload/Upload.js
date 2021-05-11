import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React,{useState} from 'react';
import 
    {Form,
    Container,
    FormContent,
    FormInput, 
    FormButton, 
    FormH1, 
    FormWrap, 
    TextArea, 
    FormLabel,
    InputLabel
} from './Elements'

const VideoForm = () => {
    
    const [selectedFile,setVal] = useState("");
    const [isFileSelected,setSelection] = useState(false);
    const [data,setData] = useState({
        title: "",
        description: "",
        videofile: ""
    });

    const [submittedeData,setSubmittedData] = useState({
        title: "",
        description: "",
        videofile: ""
    })


    const inputEvent = (e) => {
        setVal(e.target.files[0]);
        setSelection(true);
    }

    const InputEvent = (e) => {
        const {name,value} = e.target;

        setData((preValue) => {
            return {
                ...preValue,
                [name] : value
            }
        })
    }
    

    const handleSubmit = (e) => {
        e.preventDefault();
       
        if(isFileSelected){
            data.videofile = selectedFile.name;
        }

        setSubmittedData(data);
        
    };

    
    return (
        <Container>
            <FormWrap>
                <FormContent>
                    <Form onSubmit={handleSubmit}>
                        <FormH1>Upload Video</FormH1>
                        <FormInput 
                        type='text' 
                        placeholder='Enter title'
                        onChange = {InputEvent}
                        value = {data.title}
                        name = 'title'
                        required
                        />
                        <TextArea 
                        type='text' 
                        placeholder='Enter description'
                        onChange = {InputEvent}
                        value = {data.description}
                        name="description"
                        />
                        <FormLabel>Upload a File:</FormLabel>
                        <InputLabel>
                        <input 
                        style={{display: "none"}} 
                        type="file" 
                        name="videofile" 
                        accept="video/*" 
                        onChange={inputEvent} />
                        <CloudUploadIcon style={{marginRight: "10px"}}/> 
                        Choose video
                        </InputLabel>
                        {
                           isFileSelected &&
                          <FormLabel>File name: {selectedFile.name}</FormLabel>  
                        }
                        <FormButton type="submit">
                        Upload
                        </FormButton>
                    </Form>
                </FormContent>
            </FormWrap>
        </Container>
                
    );
    
}

export default VideoForm;