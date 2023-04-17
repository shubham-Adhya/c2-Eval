const express= require("express");
const blogRouter=express.Router()
const {BlogModel} = require("../model/blogs.model")
const {authorize}= require("../middlewares/authorize")

//create
blogRouter.post("/create",async (req,res)=>{
    req.body.createdAt= new Date().toISOString()
    req.body.userId=req.userId
    try {
        const blog=new BlogModel(req.body)
        blog.save()
        res.status(200).send({message: "New blog has been created"})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
})
// read
blogRouter.get("/",async(req,res)=>{
    const query=req.query
    try {
        const allblogs=await BlogModel.find(query)
        return res.status(200).send(allblogs)
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
})
blogRouter.get("/:blogID",async(req,res)=>{
    const {blogID} =req.params
    try {
        const allblogs=await BlogModel.find({_id:blogID})
        
        return res.status(200).send(allblogs)
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
})

//update
blogRouter.patch("/:blogID",async(req,res)=>{
    const {blogID} =req.params
    const payload=req.body
    try {
        const blog=await BlogModel.findById(blogID)
        if(blog.userId != req.userId){
            return res.status(401).send({ message: "Unauthorized" })
        }else{
            await BlogModel.findOneAndUpdate({_id:blogID},payload)
            return res.status(200).send({message: "Blog Updated"})
        }
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
})

//delete
blogRouter.delete("/:blogID",async(req,res)=>{
    const {blogID} =req.params
    try {
        const blog=await BlogModel.findById(blogID)
        if(blog.userId != req.userId){
            return res.status(401).send({ message: "Unauthorized" })
        }else{
            await BlogModel.findOneAndDelete({_id:blogID})
            return res.status(200).send({message: "Blog deleted"})
        }
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
})





module.exports={
    blogRouter
}