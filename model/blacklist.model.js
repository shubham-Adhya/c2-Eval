const mongoose=require("mongoose")

const blSchema=mongoose.Schema({
    BL_Token: String
},{
    versionKey: false
})

const BLModel=mongoose.model("BL_list",blSchema);

module.exports={
    BLModel
}