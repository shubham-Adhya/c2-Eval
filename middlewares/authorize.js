const authorize=(PermittedRoles)=>{
    return (req,res,next)=>{
        const user_role=req.role;

        if(PermittedRoles.includes(user_role)){
            next()
        }else{
            return res.status(401).send({message: "Unauthorized"})
        }
    }
}

module.exports={
    authorize
}