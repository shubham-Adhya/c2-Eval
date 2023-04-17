const express=require("express")
const {connection}= require("./configs/db")

const {userRouter} = require("./routes/user.routes")
const {blogRouter} = require("./routes/blogs.routes")
const {BlogModel} = require("./model/blogs.model")

const {authmiddleware}= require("./middlewares/auth.middleware")
const {authorize} =require("./middlewares/authorize")

const cors=require('cors')
require("dotenv").config();

const app=express();
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    return res.send({message: "Welcome to Blogs App"})
})


app.use("/user",userRouter)

app.use(authmiddleware)
app.use("/blogs",blogRouter)


//for moderator
app.delete("/modonly/blog/:blogID",authorize(["Moderator"]),async(req,res)=>{
    const {blogID} =req.params
    try {
        
        await BlogModel.findOneAndDelete({_id:blogID})
        return res.status(200).send({message: "Blog deleted by moderator"})
        
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
})



app.listen(process.env.PORT, async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log("Not able to connect to DB");
        console.log(error)
    }
    console.log(`Server is running at port ${process.env.PORT}`)
})