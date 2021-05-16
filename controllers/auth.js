const User = require("../models/User");
const OTPmodel = require("../models/OTPmodel");
const bcrypt = require("bcryptjs");
var transporter = require("../utils/nodemailer");
exports.generateOTP =(n)=>{
  let s = 0;
  for(var i=0;i<n;i++){
    s = s*10 + Math.floor(Math.random()*10);
  }
  return parseInt(s);
}
exports.login = async (req, res, next) => {
    const { email, password} = req.body;

  // make sure the email, pw is not empty
  if (!email) {
    return next({
      message: "Please fill your email or username",
      statusCode: 400,
    });
  }
  if (!password) {
    return next({
      message: "Please fill your password",
      statusCode: 400,
    });
  }

  let user;
  // check if the user exists
  if(email.indexOf("iitr.ac.in")>-1)
     user = await User.findOne({ email });
  else
    user = await User.findOne({username:email});

  if (!user) {
    return next({
      message: "This username or email is not yet registered to an account",
      statusCode: 400,
    });
  }
  if(!user.tempid){
    user.tempid = this.generateOTP(16);
    await user.save();
  }
  // if exists, make sure the password matches
  const match = await user.checkPassword(password);

  if (!match) {
    return next({ message: "The password does not match", statusCode: 400 });
  }
  const token = user.getJwtToken();

  // then send json web token as response
  res.status(200).json({ success: true,token: token });
};
exports.OTPVerify = async(req,res,next) =>{
  const {email} = req.body;
  
  if(email.indexOf("iitr.ac.in")==-1){
    return next({
      message:"Kindly use your institute email id",
      statusCode:400,
    })
  }
  const user = await User.findOne({email});
  if(user){
    return next({
      message:"This email is already registered",
      statusCode:400
    })
  }
  const ifOTP = await OTPmodel.findOne({email});
  if(ifOTP){
    ifOTP.remove();
  }
  const OTP = this.generateOTP(6);
  const expires=Date.now()+7200000;
  await OTPmodel.create({email,OTP,expires});
  const msg ={
    to:email,
    from:process.env.EMAIL,
    subject:"OTP for signup",
    text:"Hello "+email+",\nhere is the OTP for signup\n"+OTP+"\n\nThis OTP will expire in 2 hours\nThis is a system generated mail.So kindly do not reply.\n\n😊️ Happy Streaming 😊️\n Letstream Team",
    
  };
  transporter.sendMail(msg).then(()=>{
    res.status(200).json({success:true,message:"Kindly check your email for the OTP"});
  }).catch((error)=>{
    res.status(500).json({success:false,message:"Email could not be sent.Please retry"});
  })
  

}
exports.requestOTPForPwChange = async (req, res, next) =>{
  const {email} = req.body;
  const type = "changepassword";
  if(!email){
    return next({
      statusCode:400,
      message:"Please enter your email"
    })
  }
  const user = await User.findOne({email});
  if(!user){
    return next({
      statusCode:400,
      message:"No account found with this email"
    })
  }
  const n = Math.floor(Math.random()*4 + 6);
  const OTP = this.generateOTP(n);
  
 
  const expires = Date.now()+ 7200000;
  const checkearlierotp = await OTPmodel.findOne({email,type});
  if(checkearlierotp){
    await checkearlierotp.remove();
  }
  const msg ={
    to:email,
    from:process.env.EMAIL,
    subject:"OTP for recovering account",
    text:"Hello "+email+",\nhere is the OTP for recovering your account\n"+OTP+"\n\nThis OTP will expire in 2 hours\nThis is a system generated mail.So kindly do not reply.\n\n😊️ Happy Streaming 😊️\n Letstream Team",
    
  };  
  OTPmodel.create({OTP,email,expires,type}).then(()=>{
    transporter.sendMail(msg).then(()=>{
      res.status(200).json({success:true,message:"Kindly check your email for OTP"});
    }).catch(err=>{
      return next({
        statusCode:500,
        message:"Email could not be sent.Please retry"
      })
    }).catch(err=>{
      return next({
        statusCode:500,
        message:"Email could not be sent.Please retry"
      }) 
    })
  });

}
exports.changepassword = async(req,res,next)=>{
  const {email,password,OTP} = req.body;
  console.log(req.body);
  if(!email){
    return next({
      statusCode:400,
      message:"Please fill your email"
    })
  }
    if(!password){
      return next({
        statusCode:400,
        message:"Please fill your new password"
      })
    }
    if(password.length<6||password.length>20){
      return next({
        statusCode:400,
        message:"Password should be min 6 and max 20 characters in length"
      })
    }
    if(!OTP){
      return next({
        statusCode:400,
        message:"Please enter the OTP"
      })
    }
    const ifotp = await OTPmodel.findOne({email,OTP,type:"changepassword",expires:{$gt:Date.now()}});
    const shoulddelete = await OTPmodel.findOne({email,OTP,type:"changepassword",expires:{$lt:Date.now()}});
    if(ifotp){
     const user =  await User.findOne({email}).populate({
       path:"subscribedto",
       select:"username avatar"
     }).select("-password");
     
     if(!user){
       return next({
         statusCode:404,
         message:"No user found"
       })
     }
     const tempid = this.generateOTP(16);
     user.socketId = [];     
    await user.updatePassword(password,tempid);
    await user.save();
    setTimeout(async function(){
    const token = await user.getJwtToken();
    req.user = user;
    res.status(200).json({ success: true,subscribedto:req.user.subscribedto,token: token,user:user });
  },500)
    }
    else{
      if(shoulddelete){
        await shoulddelete.remove();
        return next({
          statusCode:404,
          message:"OTP is expired now"
        })
      }
      return next({
        statusCode:404,
        message:"OTP did not match"
      })
    }
}

exports.signup = async (req, res, next) => {
  const { fullname, username, email, password,OTP } = req.body;
  if((/^[a-z0-9]+$/i).exec(username)==null){
    return next({
      message:"username should only contain letter and digit",
      statusCode:404
    })
  }
  const usercheck = await User.findOne({ email });
  const seccheck = await User.findOne({username});
  if(usercheck){
    return next({
      message: "This email is already registered to an account",
      statusCode: 400,
    });
  }
  if(seccheck){
    return next({
      message: "This username is already registered to an account",
      statusCode: 400,
    });
  }
  const OTPVerify = await OTPmodel.findOne({email:email,OTP:OTP});
  if(!OTPVerify){
    return next({
      message:"OTP did not match",
      statusCode:400,
    })    
  }
  const expired = await OTPmodel.findOne({email:email,expires:{$lt:Date.now()}});
  console.log(expired);
  if(expired){
    OTPVerify.remove();
     return next({       
       message:"Your OTP is expired now",
       statusCode:400,
     }) 
  }
  if(password.length<6||password.length>20){
    return next({
      message:"Password should have 6-20 characters",
      statusCode:400
    })
  }
  OTPVerify.remove();
  const tempid = this.generateOTP(16);
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(password, salt);
  const user = await User.create({ fullname, username,tempid, email, password:pass });

  const token = user.getJwtToken();

  res.status(200).json({ success: true,token: token });
};

exports.me = async (req, res, next) => {
  console.log('me',req.user);
  const { avatar, username, fullname, email, _id, website, bio } = req.user;

  res
    .status(200)
    .json({
      success: true,
      data: { avatar, username, fullname, email, _id, website, bio},
      subscribedto:req.user.subscribedto,
    });
};