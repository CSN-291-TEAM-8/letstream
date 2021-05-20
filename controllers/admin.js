const Video = require("../models/Video");
const User = require("../models/User");

exports.deleteVideo = async (req, res, next) =>{
    if(!req.user.isAdmin)
        return next({
            statusCode:401,
            message:"Action failed"
        })
    try{
        const vid = await Video.findById(req.params.videoid);
        if(vid){
            await vid.remove();
        }
        else{
            return next({
                statusCode:404,
                message:"Action failed"
            })
        }
    }
    catch(err){
        if(err){
            return next({
                statusCode:400,
                message:"Action failed"
            })
        }
    }
    res.status(200).json({success:true,message:"Video was deleted successfully"});
}

exports.deleteUserId = async(req,res,next) =>{
    if(!req.user.isAdmin&&req.params.userid!=req.user.id)
        return next({
            statusCode:401,
            message:"Action failed"
        })
    try{
        const uid = await User.findById(req.params.userid);
        if(uid){
            await uid.remove();
        }
        else{
            return next({
                statusCode:404,
                message:"Action failed"
            })
        }
    }
    catch(err){
        if(err){
            console.log(err);
            return next({
                statusCode:400,
                message:"Action failed"
            })
        }
    }
    res.status(200).json({success:true,message:"User was deleted successfully"});
}