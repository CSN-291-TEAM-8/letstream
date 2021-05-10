//field text,_id,createdAt,likesCount,dislikesCount,isdisLikedbyme,isLikedbyme,user


export const getComments = ()=>{//Replied to field may be there or not..there
    const comments = [
        {text:"hello!",_id:"1",createdAt:1620645731796,likesCount:23,dislikesCount:12,isLikedbyme:true,isdisLikedbyme:false,user:{username:"kk2000",avatar:"https://kkleap.github.io/assets/default.jpg"}},

        {text:"hello2!",_id:"1",createdAt:1620645731796,likesCount:23,dislikesCount:11,isLikedbyme:false,isdisLikedbyme:false,user:{username:"kk2000",avatar:"https://kkleap.github.io/assets/default.jpg"}},

        {text:"hello 1!",Repliedto:"himil",_id:"1",createdAt:1620645731796,likesCount:223,dislikesCount:190,isLikedbyme:false,isdisLikedbyme:true,user:{username:"kk2000",avatar:"https://kkleap.github.io/assets/default.jpg"}},

        {text:"hello!",Repliedto:"himil",_id:"1",createdAt:1620645731796,likesCount:213,dislikesCount:989,isLikedbyme:true,isdisLikedbyme:false,user:{username:"kk2000",avatar:"https://kkleap.github.io/assets/default.jpg"}},

        {text:"hello!",_id:"1",createdAt:1620645731796,likesCount:203,dislikesCount:1,isLikedbyme:true,isdisLikedbyme:false,user:{username:"kk2000",avatar:"https://kkleap.github.io/assets/default.jpg"}}
    ],
}