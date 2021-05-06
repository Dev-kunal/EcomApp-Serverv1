const express=require("express");
const bodyParser=require("body-parser");
const router=express.Router();
const { User } = require("../models/user.model")
const { CartItem } = require("../models/cart.model");
const { WishlistItem } = require("../models/wishlist.model");
const {extend} =require("lodash");

router.use(bodyParser.json());

router.param("userId",async (req,res,next,userId)=>{
try{
  const user=await User.findById(userId);
  if(!user){
    res.status(400).json({success:false,message:"User not found"})
  }
  req.user=user;
  next();
}
 catch(err){
   res.status(400).json({success:false,message:err.message})
  }
  
})
router.route("/login")
.post(async (req,res)=>{
  try{
  let {username,password}=req.body
  const result=await User.findOne({username:username});
  if(result.password===password){
    res.status(200).json({success:true,user:result})
  }
  else{
    res.json({success:false,message:"Either youre not registered with us or you entered wrong password "})
  }
  }
  catch(err){
  res.status(500).json({ success: false, message: "unable to get user", errorMessage: err.message })
  }
})

router.route("/")
.get(async (req,res)=>{
  res.json({mesg:"Its Working"})
})
// To add new user
.post(async(req,res)=>{
   try{
    const user=req.body;
    console.log(user)
    const NewUser=new User(user);
    const savedUser=await NewUser.save();
    res.json({success:true,savedUser})
    }
  catch(err){
   res.status(500).json({ success: false, message: "unable to save User", errorMessage: err.message })
  }
})
router.route("/:userId")
.get((req,res)=>{
  let {user}=req;
  user.__v=undefined;
  res.json({success:true,user})
})
// To update userDetails
.post(async (req,res)=>{
  try{
  let {user}=req;
  const userUpdates=req.body;
  user=extend(user,userUpdates)

  user=await user.save();
  res.json({success:true,user:user})
  }
   catch(err){
    res.json({sucess:false,message:err.message})
  }
})

module.exports = router;