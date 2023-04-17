const mongoose=require("mongoose")

const blogSchema=mongoose.Schema({
    title: String,
    description: String,
    nLikes: Number,
    createdAt: String,
    userId:String
},{
    versionKey: false
})

const BlogModel=mongoose.model("blog",blogSchema);

module.exports={
    BlogModel
}