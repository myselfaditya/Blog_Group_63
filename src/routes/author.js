const jwt=require("jsonwebtoken")

const authorization=async function(req,res,next){
    try{
    let decoded=jwt.verify(token,"secret key")
    requestdauthorId=req.params.authorId
    loggedauthorId=decoded.authorId
    if(requestdauthorId !==loggedauthorId){
        return res.status(403).send({status:false,msg:"You are not authorized"})
    }
    next()
    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

module.exports.authorization=authorization