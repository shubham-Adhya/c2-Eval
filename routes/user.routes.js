const express= require("express");
const bcrypt= require("bcrypt")
const jwt= require("jsonwebtoken")

require("dotenv").config()


const {UserModel} = require("../model/user.model")
const {BLModel} = require("../model/blacklist.model")
const {authmiddleware}= require("../middlewares/auth.middleware")
const {authorize}= require("../middlewares/authorize")


const userRouter=express.Router()


userRouter.post("/signup",async(req,res)=>{
    try {
        const {name, email, password, role}=req.body;

        const userExists=await UserModel.findOne({email});
        if(userExists){
            return res.status(400).send({message: "User Already Exists"})
        }

        const hashed_pass=bcrypt.hashSync(password,5)
        const user=new UserModel({email,password:hashed_pass,name,role})
        user.save()
        return res.status(200).send({message: "User Created Successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
})

userRouter.post("/login",async(req,res)=>{
    try {
        const {name, email, password}=req.body;

        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(401).send({message: "User not found"})
        }

        const passCompare=await bcrypt.compare(password, user.password)
        if(!passCompare){
            return res.status(401).send({message: "Wrong credentials"}) 
        }

        const token=jwt.sign({userId:user._id},process.env.JWT_Secret,{
            expiresIn: '1h'
        })
        const refreshToken=jwt.sign({userId:user._id},process.env.JWT_RefreshSecret,{
            expiresIn: '3h'
        })
        res.status(200).send({message: "Login Success",token,refreshToken})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
})

userRouter.get("/logout",(req,res)=>{
    const token=req.headers.authorization?.split(' ')[1];
    const black_token=new BLModel({BL_Token:token})
    black_token.save();
    res.status(200).send({message: "Logout Successfull"})
})

userRouter.get("/getnewtoken",async (req,res)=>{
    const refreshToken=req.headers.authorization?.split(' ')[1]
    const decoded= jwt.verify(refreshToken,process.env.JWT_RefreshSecret)
    if(decoded){
        const token=jwt.sign({userId:decoded.userId},process.env.JWT_Secret,{
            expiresIn: 60
        })
        return res.status(200).send({token})
    }
})


module.exports={
    userRouter
}