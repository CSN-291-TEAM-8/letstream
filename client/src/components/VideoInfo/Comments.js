import { Avatar } from "@material-ui/core";
import styled from "styled-components";
import React,{useState} from "react";
import Connect from "../../utils";

const CommentWrapper = styled.div`
  .addcomment{
      display:flex;
      align-items:center;
      padding-top:30px;
  }
  input{
      padding:0;
      padding-bottom:10px;
  }
  .input-for-cmnt{
    margin-left:20px;
    width:100%;
    border-bottom:1px solid ${(props)=>props.theme.borderColor};
  }

`

const CommentComp = ({comment})=>{
    return <div></div>;
}

const Comments = ({video})=>{
    const [myComment,setMyComment] = useState("");
    const [comments,setComments] = useState(video.comments);
    const addmyComment = (e)=>{
        if(myComment&&e.keyCode===13){
            Connect(`/video/${video._id}/comments`,{body:{text:myComment}}).then(data=>{
                setComments(data.comment,...comments);
            })
        }
    }
    return <CommentWrapper>
        <h3>{video.comments.length} comments</h3>
        <div className="addcomment">
            <Avatar 
                src={JSON.parse(localStorage.getItem("user")).avatar}
                alt="Me"
            />
            <div className="input-for-cmnt">
                <input
                    type="text"
                    name="comment"
                    value={myComment}
                    placeholder="Add a comment"
                    onKeyDown={addmyComment}
                    onChange={(e)=>setMyComment(e.target.value)}
                />
                    
            </div>
            <hr/>
            <div className="allcomment">
                {comments.map(function(x){
                    return <CommentComp comment={x} key={x._id}/>
                })}
            </div>
        </div>
    </CommentWrapper>;
}

export default Comments;