import { Avatar } from "@material-ui/core";
import styled from "styled-components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Connect, { timeSince } from "../../utils";
import { toast } from "react-toastify";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ReplyIcon from '@material-ui/icons/Reply';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { ModalWrapper } from "../profile/EditProfile";

const CommentWrapper = styled.div`
  .addcomment{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      padding-top:30px;
      position:sticky;
      top:60px;
      z-index:2;
      background:${(props) => props.theme.bg};
  }
  input{
      padding:0;
      padding-bottom:10px;
  }
  .bold{
      font-weight:bold;
      font-size:17px;
      cursor:pointer;
      color:#f00;
  }
  .allcomment{
      padding-top:40px;
  }
  .input-for-cmnt{
    margin-left:20px;
    width:90%;
    border-bottom:1px solid ${(props) => props.theme.borderColor};
  }
  .comment_wrapper{
      padding-top:30px;
      display:flex;
      flex-wrap:nowrap;
      align-items:center;
  }
  .comment_stats{
      display:flex;
      flex-wrap:nowrap;
      justify-content:space-between;
      width:160px;
      padding-top:10px;
  }
  .moreopcmnt{
      position:relative;
      top:8px;
      left:20px;
  }
  .icondiv{
      display:flex;
      width:40px;
      justify-content:space-between;
  }
  .comment_des{
      word-break:break-all;
  }
  .comment_avatar{
      padding-right:20px;
      cursor:pointer;
  }

`

const CommentComp = ({ comment, history, Activities,isAdmin,openCommentOption }) => {
    return <div className="comment_wrapper">
        <div className="comment_avatar" onClick={() => history.push(`/user/${comment.user._id}`)}><Avatar src={comment.user.avatar} />
        </div>
        <div className="comment_des"><p><span className="bold" onClick={() => history.push(`/user/${comment.user._id}`)}>{comment.user.username}</span>&nbsp;&nbsp;{comment.text}</p>
            <i className="secondary">Commented {timeSince(comment.createdAt, true)} ago {(isAdmin||comment.isMine)&&<span className="moreopcmnt" onClick={()=>openCommentOption(isAdmin,comment._id)}><MoreHorizIcon/></span>}</i>
            <div className="comment_stats">
                <div className="icondiv">
                    {comment.isLiked ? <ThumbUpIcon size={14} color="secondary" onClick={() => Activities({ type: "likecomment", cid: comment._id })} /> : <ThumbUpIcon size={14} onClick={() => Activities({ type: "likecomment", cid: comment._id })} />} <span>{comment.likesCount}</span>
                </div>
                <div className="icondiv" >
                    {comment.isdisLiked ? <ThumbDownIcon size={14} color="secondary" onClick={() => Activities({ type: "dislikecomment", cid: comment._id })} /> : <ThumbDownIcon size={14} onClick={() => Activities({ type: "dislikecomment", cid: comment._id })} />} <span>{comment.dislikesCount}</span>
                </div>
                <div className="icondiv">
                    <ReplyIcon size={14} />
                </div>
            </div>
        </div>
    </div>;
}

const Comments = ({ video }) => {
    const [myComment, setMyComment] = useState("");
    const [comments, setComments] = useState(video?.comments);
    const [orig, setOrig] = useState(video?.comments);
    const history = useHistory();
    const [ignored, forceUpdate] = React.useReducer(x => x + 0.5, 0);

    const Activities = ({ type, cid }) => {
        let t;
        switch (type) {
            case "likecomment":
                Connect(`/video/${cid}/likecomment`, { method: "POST" }).then((d) => {
                    t = comments;
                    t.forEach((c) => {
                        if (c._id === cid) {
                            if (d.isLiked) {
                                if (c.isdisLiked)
                                    c.dislikesCount = c.dislikesCount - 1;
                                c.likesCount = c.likesCount + 1;
                            }
                            else {
                                c.likesCount = c.likesCount - 1;
                            }
                            c.isLiked = d.isLiked;
                            c.isdisLiked = d.isdisLiked;
                        }
                    });
                    setComments(t);
                    forceUpdate();
                    // orig.map((c) => { if (c._id === cid) { 
                    //     if(d.isLiked){
                    //         if(c.isdisLiked)
                    //             c.dislikesCount = c.dislikesCount - 1;
                    //         c.likesCount = c.likesCount + 1;
                    //     }
                    //     else{
                    //         c.likesCount = c.likesCount - 1;
                    //     }
                    //     c.isLiked = d.isLiked; c.isdisLiked = d.isdisLiked } })
                    // setOrig(orig);
                    //console.log(t);

                }).catch(err => toast.error("An error occurred"));
                break;
            case "dislikecomment":
                Connect(`/video/${cid}/dislikecomment`, { method: "POST" }).then((d) => {
                    t = comments;
                    t.forEach((c) => {
                        if (c._id === cid) {
                            if (d.isdisLiked) {
                                if (c.isLiked)
                                    c.likesCount = c.likesCount - 1;
                                c.dislikesCount = c.dislikesCount + 1;
                            }
                            else {
                                c.dislikesCount = c.dislikesCount - 1;
                            }
                            c.isLiked = d.isLiked;
                            c.isdisLiked = d.isdisLiked
                        }
                    })
                    setComments(t);
                    forceUpdate();
                    // orig.map((c) => { if (c._id === cid) { 
                    //     if(d.isdisLiked){
                    //         if(c.isLiked)
                    //             c.likesCount = c.likesCount - 1;
                    //         c.dislikesCount = c.dislikesCount + 1;
                    //     }
                    //     else{
                    //         c.dislikesCount = c.dislikesCount - 1;
                    //     }
                    //     c.isLiked = d.isLiked; 
                    //     c.isdisLiked = d.isdisLiked } })
                    // setOrig(orig);
                    //console.log(t);

                }).catch(err => toast.error("An error occurred"));
                break;
            default:
                break;
        }
    }

    const [commentoption,setCommentOptionId] = useState(null);

    const closeModal = ()=>{
        setCommentOptionId(null);
    }

    const addmyComment = (e) => {
        if (myComment && e.keyCode === 13) {
            Connect(`/video/${video._id}/comments`, { body: { text: myComment } }).then(data => {
                data.comment.isMine = true;
                setComments([data.comment, ...comments]);
                setOrig([...comments, data.comment]);
                setMyComment("");
            }).catch(err => {
                toast.error("An error occurred");
            })
        }
    }

    const openCommentOption =(isAdmin,cid)=>{
        setCommentOptionId(cid);
    }

    const rearrangeComments = (e) => {
        let data2;
        switch (e.target.value) {
            case "oldest":
                data2 = [...orig];
                setComments(data2);
                break;
            case "latest":
                data2 = [...orig].reverse();
                setComments(data2);
                break;
            case "highlighted":
                data2 = [...orig].sort(function (a, b) { return b.likesCount - b.dislikesCount - a.likesCount + a.dislikesCount })
                setComments(data2);
                break;
            default:
                break;
        }
    }

    const deleteComment = ()=>{
        Connect(`/video/${video._id}/comments/${commentoption}`,{method:"DELETE"}).then((d)=>{
            toast.success("Comment deleted successfully");
            setComments(comments.filter(x=>x._id!==commentoption));
            setCommentOptionId(null);
        }).catch(err=>{
            toast.error("Failed to delete the comment")
        })
    }
    if (!video) {
        return <div></div>;
    }
    return <CommentWrapper>
        {
            commentoption&&<ModalWrapper>
                <div className="modal-content">
                    <div className="choice danger" onClick={closeModal}>Cancel</div>
                    <div className="choice" onClick={deleteComment}>Delete comment</div>
                </div>
            </ModalWrapper>
        }
        <span>{video?.comments?.length} comments</span>

        <select onChange={rearrangeComments} style={{ marginLeft: "20px" }}>
            <option value="oldest">Oldest first</option>
            <option value="latest">Latest first</option>
            <option value="highlighted">Top comments first</option>
        </select>
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
                    onChange={(e) => setMyComment(e.target.value)}
                />

            </div>
        </div>

        <div className="allcomment">
            {comments?.map(function (x) {
                return <CommentComp comment={x} isAdmin={video?.isAdmin} key={x._id} history={history} Activities={Activities} openCommentOption={openCommentOption} />
            })}
        </div>

    </CommentWrapper>;
}

export default Comments;